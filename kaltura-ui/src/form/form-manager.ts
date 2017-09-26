import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import { FormWidget, FormWidgetState } from './form-widget';

export declare type FormWidgetsState = {
    [key : number] : FormWidgetState
}

export enum OnDataSavingReasons
{
    attachedWidgetBusy,
    validationErrors,
    buildRequestFailure
}

export abstract class FormManager<TData, TRequest> implements OnDestroy {
    private _widgets: FormWidget<TData, TRequest>[] = [];
    private _widgetsState: BehaviorSubject<FormWidgetsState> = new BehaviorSubject<FormWidgetsState>({});
    public widgetsState$ = this._widgetsState.asObservable();

    public get widgetsState(): FormWidgetsState {
        return this._widgetsState.getValue();
    }

    public updateWidgetState(newWidgetState : FormWidgetState): void {
        const currentWidgetsState = this._widgetsState.getValue();

        if (!newWidgetState || !newWidgetState.key) {
            console.warn('form manager: cannot update widget state, missing widget key');
        } else {
            console.log(`widget '${newWidgetState.key}': update widget state`, newWidgetState);
            currentWidgetsState[newWidgetState.key] = newWidgetState;
            this._widgetsState.next(currentWidgetsState);

        }
    }

    public registerWidgets(widgets : FormWidget<TData,TRequest>[])
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
                    console.log(`widget '${widget.key}': registered to a form manager`);
                    widget.setManager(this);
                    this._widgets.push(widget);
                }
            })

        }
    }

    public onDataLoading(dataId: any): void {

        this._widgets.filter(widget => widget.isActive).forEach(widget => {
            console.log(`widget '${widget.key}': reset widget (previous state ${widget.wasActivated ? 'active' : 'inactive'})`);
            widget.reset();
        });

        this._widgets.forEach(widget => {
            widget.onDataLoading(dataId);
        });
    }

    public onDataLoaded(data: TData) : { errors?: Error[] } {

        const errors : Error[] = [];
        this._widgets.forEach(widget => {

            try {
                widget.onDataLoaded(data);
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

        this._widgets.filter(widget => widget.isActive).forEach(widget => {
            try {
                console.log(`widget '${widget.key}': build save request content`);
                widget.onDataSaving(newData, request, originalData);
            } catch (err) {
                console.error(`widget '${widget.key}': failed to prepare data for save. Save operation aborted.`, err); // keep error
                errors.push(err);
            }
        });

        return {errors};
    }


    public onDataSaving(newData: TData, request: TRequest, originalData: TData): Observable<{ ready: boolean, reason?: OnDataSavingReasons, errors?: Error[] }> {

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
        const widgetsResults = this._widgets.filter(widget => widget.isActive).map(widget => {
            return widget.validate()
                .cancelOnDestroy(this)
                .monitor(`widget '${widget.key}': is valid?`)
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


    public findWidgetByKey(widgetKey: string): FormWidget<TData,TRequest> {
        return <FormWidget<TData,TRequest>>this._widgets.find(widget => widget.key === widgetKey);
    }

    ngOnDestroy() {
        this._widgetsState.complete();
    }

    public attachWidget<TWidget extends FormWidget<TData,TRequest>>(widgetType : { new(...args) : TWidget}) : TWidget {
        const widget = this._widgets.find(widget => widget instanceof widgetType);


        if (!widget) {
            console.warn(`[kaltura] Cannot find requested widget in registered widgets list (did you register a widget with that key?)`);
        } else if (!(widget instanceof widgetType)) {
            console.warn(`[kaltura] Cannot find widget with key '${widget.key}' (did you register a widget with that key?)`);
        }else {
            const widgetState = this.widgetsState[widget.key];
            if (widgetState && widgetState.isAttached) {
                console.warn(`[kaltura] widget with key '${widget.key}' is already attached (did you attached two components to the same widget? or did you forgot to detach the widget upon ngOnDestroy?)`);
            }

            console.log(`widget '${widget.key}': widget is now attached`);
            widget.attach();

            return widget;
        }

        return null;
    }

    public detachWidget(widget : FormWidget<TData,TRequest>) : FormWidget<TData,TRequest>{
        const isWidgetOfForm = this._widgets.indexOf(widget) !== -1;

        if (!isWidgetOfForm) {
            console.warn(`[kaltura] Cannot find registered widget with key '${widget.key}' (did you register a widget with that key?)`);
        } else {
            const widgetState = this.widgetsState[widget.key];
            if (widgetState && !widgetState.isAttached) {
                console.warn(`[kaltura] widget with key '${widget.key}' is already detached`);
            }

            console.log(`widget '${widget.key}': widget is now detached`);
            widget.detach();
        }

        return widget;
    }

}
