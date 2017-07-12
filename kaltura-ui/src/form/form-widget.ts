import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/of';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import 'rxjs/add/operator/catch';
import { FormManager } from './form-manager';

export declare type FormWidgetState = { key : string, isActive : boolean,  isValid : boolean, isDirty : boolean, isBusy : boolean, isAttached : boolean, wasActivated : boolean };

export abstract class FormWidget<TData, TRequest> implements OnDestroy
{
    public get data(): TData {
        return this._data;
    }

    public set data(value: TData) {
        this._data = value;
        this._dataSource.next(value);
    }
    private _data: TData;
    private _dataSource: ReplaySubject<TData> = new ReplaySubject<TData>(1);
    public data$ = this._dataSource.asObservable();

    constructor(private _key : string)
    {
        if (!_key)
        {
            throw new Error(`Form widget key is required when constructing widget of type '${typeof this}`);
        }
    }

    private _widgetState : FormWidgetState = {key: this.key, isValid: true, isDirty: false, isAttached: false, isBusy : false, isActive : false,  wasActivated : false};

    protected _onDataSaving(newData: TData, request: TRequest, originalData: TData): void;
    protected _onDataSaving(newData: TData, request: TRequest): void;
    protected _onDataSaving(newData: TData, request: TRequest, originalData?: TData): void {
    }
    protected _manager : FormManager<TData, TRequest>;

    private _widgetReset : Subject<any> = new Subject<any>();
    public widgetReset$ = this._widgetReset.asObservable();

    public get wasActivated(): boolean {
        return this._widgetState.wasActivated;
    }

    public get isValid(): boolean {
        return this._widgetState.isValid;
    }

    public get isDirty(): boolean {
        return this._widgetState.isDirty;
    }

    public get isActive(): boolean {
        return this._widgetState.isActive;
    }

    public get isAttached(): boolean {
        return this._widgetState.isAttached;
    }

    public get isBusy(): boolean {
        return this._widgetState.isBusy;
    }

    public get key(): string
    {
        return this._key;
    }

    protected _onValidate(): Observable<{isValid: boolean}> {
        return Observable.of({isValid: true});
    }

    protected _updateWidgetState(stateUpdate : Partial<FormWidgetState>) : void {
        const stateHasChanges = Object.keys(stateUpdate).reduce((result, propertyName) => result || this._widgetState[propertyName] !== stateUpdate[propertyName], false);

        if (stateHasChanges) {
            Object.assign(this._widgetState, stateUpdate);

            if (this._manager) {
                const newWidgetState = Object.assign({}, this._widgetState);
                this._manager.updateWidgetState(newWidgetState);
            }
        }
    }

    protected _onDataLoaded(data: TData): void {
    }

    protected _onDataLoading(dataId: any): void {
    }

    protected abstract _onReset();

    protected _onActivate(firstTimeActivating: boolean): Observable<{failed: boolean, error?: Error}> | void {
    }

    public setManager(manager : FormManager<TData,TRequest>) :void {
        this._manager = manager;
    }

    public onDataLoading(dataId: string): void {
        this.data = null;
        this._onDataLoading(dataId);
    }

    public onDataLoaded(data: TData): void {
        this.data = data;
        this._onDataLoaded(data);
    }

    public validate(): Observable<{isValid: boolean}> {
        if (this.wasActivated) {
            return this._onValidate();
        }else {
            return Observable.of({isValid : true});
        }
    }

    public onDataSaving(newData: TData, request: TRequest, originalData: TData): void {
        if (this.wasActivated) {
            this._onDataSaving(newData, request, originalData);
        }
    }

    public reset(): void {
        console.log(`widget ${this.key}: reset widget`);
        this._widgetReset.next('');
        this._updateWidgetState({ isValid: true, isDirty: false, isActive : false});
        this._onReset();
    }

    public activate(): void {

        if (this.data && this.isAttached && !this.isActive) {

            this.reset();

            const previousStatus = {
              wasActivated : this.wasActivated
            };
            const activate$ = this._onActivate(!this.wasActivated);

            // update status
            this._updateWidgetState({ isActive : true, isBusy : true, wasActivated : true});

            if (activate$ instanceof Observable) {
                activate$
                    .cancelOnDestroy(this, this._widgetReset)
                    .monitor(`widget ${this.key}: activated widget (first time = ${!previousStatus.wasActivated})`)
                    .catch((error, caught) => Observable.of({failed: true, error}))
                    .subscribe(
                        response => {
                            if (response && response.failed) {
                                console.log(`widget ${this.key}: widget activation failed. revert status to ${JSON.stringify(previousStatus)})`);
                                this._updateWidgetState({ isActive : false, isBusy : false, wasActivated : previousStatus.wasActivated});
                            }else {
                                this._updateWidgetState({ isBusy : false });
                            }
                        },
                        null);
            } else {
                console.log(`widget ${this.key}: activated widget (first time = ${!previousStatus.wasActivated})`);
                this._updateWidgetState({ isBusy : false });
            }
        }
    }


    public attach() : void{
        this._updateWidgetState({ isAttached : true});

        this.activate();
    }

    public detach() : void{
        this._updateWidgetState({ isAttached : false});
    }


    ngOnDestroy() {
        this.reset();
        this._widgetReset.complete();
    }

}