import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import { WidgetBase } from './widget-base';
import { WidgetState } from './widget-state';
import { KalturaLogger } from '../../../kaltura-logger/src/kaltura-logger.service';

export declare type FormWidgetsState = {
    [key : number] : WidgetState
}

export enum OnDataSavingReasons
{
    attachedWidgetBusy,
    validationErrors,
    buildRequestFailure
}

export abstract class WidgetsManagerBase<TData, TRequest> implements WidgetsManagerBase<TData, TRequest>, OnDestroy {
    private _widgets: WidgetBase<this, TData, TRequest>[] = [];
    private _widgetsState: BehaviorSubject<FormWidgetsState> = new BehaviorSubject<FormWidgetsState>({});
    private _isNewData = false;
    public widgetsState$ = this._widgetsState.asObservable();
    private _logger: KalturaLogger;

    public get widgetsState(): FormWidgetsState {
        return this._widgetsState.getValue();
    }

    public get isNewData(): boolean{
        return this._isNewData;
    }

    constructor(logger?: KalturaLogger) {
	    if (logger) {
		    this._logger.subLogger(`WidgetsManagerBase`);
	    }
    }

	private _log(level: 'info'|'warn'|'error', message: string, context?: {}): void {
		if (this._logger) {
			switch (level) {
				case 'info':
					this._logger.info(message,context);
					break;
				case 'warn':
					this._logger.warn(message,context);
					break;
				case 'error':
					this._logger.warn(message,context);
					break;

			}
		}
	}

    public _updateWidgetState(newWidgetState : WidgetState): void {
        const currentWidgetsState = this._widgetsState.getValue();

        if (!newWidgetState || !newWidgetState.key) {
	        this._log('warn', 'cannot update widget state, missing widget key');
        } else {
	        this._log('info', `update widget state`, { newWidgetState, widget: newWidgetState.key});
            currentWidgetsState[newWidgetState.key] = newWidgetState;
            this._widgetsState.next(currentWidgetsState);

        }
    }

    public registerWidgets(widgets : WidgetBase<this, TData,TRequest>[])
    {
        if (widgets)
        {
            widgets.forEach(widget =>
            {
                const existingRegisteredWidget = this._widgets.find(registeredWidget => registeredWidget === widget || registeredWidget.key === widget.key);

                if (existingRegisteredWidget)
                {
                    throw new Error(`a widget with key '${widget.key}' is already registered (did you registered the same widget twice?)`);
                }else {
	                this._log('info', `registered to a form widgets manager`);
                    widget._setForm(this);
                    this._widgets.push(widget);
                }
            })

        }
    }

    public notifyDataLoading(dataId: any): void {
	    this._log('info', `notify data loading. data identifier '${dataId}'`);

        this._widgets.filter(widget => widget.isActive).forEach(widget => {
            widget._reset();
        });

        this._widgets.forEach(widget => {
            widget._handleDataLoading(dataId);
        });
    }

    public notifyDataLoaded(data: TData, settings: { isNewData: boolean }) : { errors?: Error[] } {

	    this._log('info', `notify data loaded.`);
        const errors : Error[] = [];
        this._isNewData = settings.isNewData;
	    this._log('info', `treat data as '${this._isNewData ? 'new' : 'existing'} data'.`);
        this._widgets.forEach(widget => {

            try {
                widget._handleDataLoaded(data);
                widget.activate();
            }catch(e)
            {
                errors.push(e);
            }
        });

        return { errors };
    }

    private _widgetsOnDataSaving(newData: TData, request: TRequest, originalData: TData): { errors?: Error[] } {
        const errors: Error[] = [];
        const widgets = this._isNewData ? this._widgets : this._widgets.filter(widget => widget.isActive);
        widgets.forEach(widget => {
            try {
	            this._log('info', `widget '${widget.key}': build save request content`);
                widget._handleDataSaving(newData, request, originalData);
            } catch (err) {
	            this._log('error', `widget '${widget.key}': failed to prepare data for save. Save operation aborted.`, err); // keep error
                errors.push(err);
            }
        });

        return {errors};
    }

    public notifyDataSaving(newData: TData, request: TRequest, originalData: TData): Observable<{ ready: boolean, reason?: OnDataSavingReasons, errors?: Error[] }> {

	    this._log('info', `notify data saving.`);

        const isAttachedWidgetBusy = !!this._widgets.find(widget => widget.isAttached && widget.isBusy);

        return Observable.of(isAttachedWidgetBusy ?
            {
                ready: false,
                reason: OnDataSavingReasons.attachedWidgetBusy
            } : {ready: true} )
            .cancelOnDestroy(this)
            .flatMap(response => {
                if (response.ready) {
                    return this._validateWidgets()
                        .catch((error, caught) => Observable.of({isValid: false}))
                        .map(response => response.isValid ? {ready: true} : {
                            ready: false,
                            reason: OnDataSavingReasons.validationErrors
                        });
                } else {
                    return Observable.of(response);
                }
            })
            .map(response => {
                if (response.ready) {
                    const saveContent = this._widgetsOnDataSaving(newData, request, originalData);

                    if (saveContent.errors.length === 0) {
                        return {ready: true, reason: null};
                    }
                    else {
                        return {
                            ready: false,
                            reason: OnDataSavingReasons.buildRequestFailure,
                            errors: saveContent.errors
                        };
                    }
                } else {
                    return response;
                }
            });
    }

    private _validateWidgets(): Observable<{ isValid: boolean }> {
        const widgets = this._isNewData ? this._widgets : this._widgets.filter(widget => widget.isActive);
        const widgetsResults = widgets.map(widget => {
            return widget._validate()
                .cancelOnDestroy(this)
                .monitor(`[widgets manager] widget '${widget.key}': is valid?`)
                .catch((err, caught) => Observable.of({isValid: false}));
        });

        if (widgetsResults.length) {
            return Observable.forkJoin(...widgetsResults).map(responses => {
                return responses.find(response => !response.isValid) || {isValid: true};
            });
        } else {
            return Observable.of({isValid: true});
        }
    }

    ngOnDestroy() {
        this._widgets.forEach(widget =>
        {
            widget.destory();
        });

	    this._log('warn', `form widgets manager ngOnDestroy');
        this._widgetsState.complete();
    }
s


}
