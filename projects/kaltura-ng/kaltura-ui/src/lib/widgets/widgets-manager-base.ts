import {Directive, OnDestroy} from '@angular/core';
import { Observable } from 'rxjs';
import { forkJoin, of } from 'rxjs';
import { flatMap, map, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { WidgetBase } from './widget-base';
import { WidgetState } from './widget-state';
import { KalturaLogger, EmptyLogger } from '@kaltura-ng/kaltura-common';
import { cancelOnDestroy, tag } from '@kaltura-ng/kaltura-common';

export declare type FormWidgetsState = {
    [key : number] : WidgetState
}

export enum OnDataSavingReasons
{
    attachedWidgetBusy,
    validationErrors,
    buildRequestFailure
}

@Directive()
export abstract class WidgetsManagerBase<TData, TRequest> implements WidgetsManagerBase<TData, TRequest>, OnDestroy {
    private _widgets: WidgetBase<this, TData, TRequest>[] = [];
    private _widgetsState: BehaviorSubject<FormWidgetsState> = new BehaviorSubject<FormWidgetsState>({});
    private _isNewData = false;
    public widgetsState$ = this._widgetsState.asObservable();
	protected _logger: KalturaLogger;

	constructor(logger?: KalturaLogger) {
		this._logger = logger ? logger.subLogger(`widgetsManager`) : new EmptyLogger();
	}

    public get widgetsState(): FormWidgetsState {
        return this._widgetsState.getValue();
    }

    public get isNewData(): boolean{
        return this._isNewData;
    }

    public _updateWidgetState(newWidgetState : WidgetState): void {
        const currentWidgetsState = this._widgetsState.getValue();

        if (!newWidgetState || !newWidgetState.key) {
            this._logger.warn('[widgets manager] cannot update widget state, missing widget key');
        } else {
            this._logger.info(`[widgets manager] widget '${newWidgetState.key}': update widget state`, newWidgetState);
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
                    this._logger.info(`[widgets manager] widget '${widget.key}': registered to a form widgets manager`);
                    widget._setForm(this);
                    this._widgets.push(widget);
                }
            })

        }
    }

    public notifyDataLoading(dataId: any): void {
        this._logger.info(`[widgets manager] notify data loading. data identifier '${dataId}'`);

        this._widgets.filter(widget => widget.isActive).forEach(widget => {
            widget._reset();
        });

        this._widgets.forEach(widget => {
            widget._handleDataLoading(dataId);
        });
    }

    public notifyDataLoaded(data: TData, settings: { isNewData: boolean }) : { errors?: Error[] } {

        this._logger.info(`[widgets manager] notify data loaded.`);
        const errors : Error[] = [];
        this._isNewData = settings.isNewData;
        this._logger.info(`[widgets manager] treat data as '${this._isNewData ? 'new' : 'existing'} data'.`);
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
                this._logger.info(`[widgets manager] widget '${widget.key}': build save request content`);
                widget._handleDataSaving(newData, request, originalData);
            } catch (err) {
                this._logger.error(`[widgets manager] widget '${widget.key}': failed to prepare data for save. Save operation aborted.`, err); // keep error
                errors.push(err);
            }
        });

        return {errors};
    }

    public notifyDataSaving(newData: TData, request: TRequest, originalData: TData): Observable<{ ready?: boolean, reason?: OnDataSavingReasons, errors?: Error[] }> {

        this._logger.info(`[widgets manager] notify data saving.`);

        const isAttachedWidgetBusy = !!this._widgets.find(widget => widget.isAttached && widget.isBusy);

        return of(isAttachedWidgetBusy ?
            {
                ready: false,
                reason: OnDataSavingReasons.attachedWidgetBusy
            } : {ready: true} )
            .pipe(cancelOnDestroy(this))
            .pipe(flatMap(response => {
                if (response.ready) {
                    return this._validateWidgets()
                        .pipe(catchError((error, caught) => of({isValid: false})))
                        .pipe(map(response => response.isValid ? {ready: true} : {
                            ready: false,
                            reason: OnDataSavingReasons.validationErrors
                        }));
                } else {
                    return of(response);
                }
            }))
            .pipe(map(response => {
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
            }));
    }

    private _validateWidgets(): Observable<{ isValid: boolean }> {
        const widgets = this._isNewData ? this._widgets : this._widgets.filter(widget => widget.isActive);
        const widgetsResults = widgets.map(widget => {
            return widget._validate()
                .pipe(cancelOnDestroy(this))
                .pipe(catchError((err, caught) => of({isValid: false})));
        });

        if (widgetsResults.length) {
            return forkJoin(...widgetsResults).pipe(map(responses => {
                return responses.find(response => !response.isValid) || {isValid: true};
            }));
        } else {
            return of({isValid: true});
        }
    }

    ngOnDestroy() {
        this._widgets.forEach(widget =>
        {
            widget.destory();
        });

        this._logger.warn('[widgets manager] form widgets manager ngOnDestroy');
        this._widgetsState.complete();
    }
s


}
