import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/of';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import 'rxjs/add/operator/catch';
import { WidgetsManagerBase } from './widgets-manager-base';
import { ISubscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';

export declare type WidgetState = { key : string, isActive : boolean,  isValid : boolean, isDirty : boolean, isBusy : boolean, isAttached : boolean, wasActivated : boolean };


// DEVELOPER NOTE: Don't implement ngOnDestroy - the inheritor will probably override this without calling super()
export abstract class WidgetBase<TForm extends WidgetsManagerBase<TData,TRequest>, TData, TRequest>
{
    public get data(): TData {
        return this._data;
    }

    // DEVELOPER NOTE: this class cannot use 'cancelOnDestroy' operation
    // because it must assume the inheriter will override it
    private _activateSubscription: ISubscription = null;

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

    private _widgetState : WidgetState = {key: this.key, isValid: true, isDirty: false, isAttached: false, isBusy : false, isActive : false,  wasActivated : false};

    protected onDataSaving(newData: TData, request: TRequest, originalData: TData): void;
    protected onDataSaving(newData: TData, request: TRequest): void;
    protected onDataSaving(newData: TData, request: TRequest, originalData?: TData): void {
    }

    protected form : TForm;

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

    protected onValidate(): Observable<{isValid: boolean}> {
        return Observable.of({isValid: true});
    }

    protected updateState(stateUpdate : Partial<WidgetState>) : void {

        this._verifyRegistered();

        const stateHasChanges = Object.keys(stateUpdate).reduce((result, propertyName) => result || this._widgetState[propertyName] !== stateUpdate[propertyName], false);

        if (stateHasChanges) {
            Object.assign(this._widgetState, stateUpdate);

            if (this.form) {
                const newWidgetState = Object.assign({}, this._widgetState);
                this.form._updateWidgetState(newWidgetState);
            }
        }
    }

    protected onDataLoaded(data: TData): void {
    }

    protected onDataLoading(dataId: any): void {
    }

    protected abstract _onReset();

    protected _onActivate(firstTimeActivating: boolean): Observable<{failed: boolean, error?: Error}> | void {
    }

    public _setForm(manager : TForm) :void {
        this.form = manager;
    }

    public _handleDataLoading(dataId: string): void {
        this._verifyRegistered();
        this._setData(null);
        this.onDataLoading(dataId);
    }

    private _setData(data: TData): void{
        this._data = data;
        this._dataSource.next(data);
    }

    public _handleDataLoaded(data: TData): void {
        this._verifyRegistered();
        this._setData(data);
        this.onDataLoaded(data);
    }

    public _validate(): Observable<{isValid: boolean}> {

        this._verifyRegistered();

        if (this.wasActivated) {
            return this.onValidate();
        }else {
            return Observable.of({isValid : true});
        }
    }

    public _handleDataSaving(newData: TData, request: TRequest, originalData: TData): void {

        this._verifyRegistered();

        if (this.wasActivated) {
            this.onDataSaving(newData, request, originalData);
        }
    }

    public _reset(): void {
        this._verifyRegistered();

        console.log(`[widget] widget '${this.key}': reset widget`);

        if (this._activateSubscription)
        {
            this._activateSubscription.unsubscribe();
            this._activateSubscription = null;
        }

        this._widgetReset.next('');
        this.updateState({ isValid: true, isDirty: false, isActive : false});
        this._onReset();
    }

    private _verifyRegistered(): void{
        if(!this.form)
        {
            console.error(`[widget] widget '${this.key}': cannot perform action, widget is not registered to a manager (did you forgot to register it in the main route component?)`);
            throw new Error(`[widget] cannot perform action. widget with key \''${this.key}'\' is not registered to a manager`);
        }
    }

    public activate(): void {

        this._verifyRegistered();

        if (this.data && this.isAttached && !this.isActive) {

            this._reset();

            const previousStatus = {
              wasActivated : this.wasActivated
            };

            console.log(`[widget] widget '${this.key}': activating widget (first time = ${!previousStatus.wasActivated})`);
            const activate$ = this._onActivate(!this.wasActivated);
            this.updateState({ isActive : true, wasActivated : true});

            if (activate$ instanceof Observable) {
                console.log(`[widget] widget '${this.key}': widget requested for async activation operation. executing async operation.`);
                this.updateState({ isBusy : true });
                this._activateSubscription = activate$
                    .monitor(`[widget] widget '${this.key}': activate widget (first time = ${!previousStatus.wasActivated})`)
                    .catch((error, caught) => Observable.of({failed: true, error}))
                    .subscribe(
                        response => {
                            if (response && response.failed) {
                                console.log(`[widget] widget '${this.key}': async widget activation failed. revert state to ${JSON.stringify(previousStatus)})`);
                                this.updateState({ isActive : false, isBusy : false, wasActivated : previousStatus.wasActivated});
                            }else {
                                console.log(`[widget] widget '${this.key}': async widget activation completed`);
                                this.updateState({ isBusy : false });
                            }
                        },
                        () => {
                            this._activateSubscription = null;
                        },
                        () => {
                            this._activateSubscription = null;
                        });
            }
        }
    }

    public attachForm() : void{
        this._verifyRegistered();

        if (this.isAttached) {
            console.warn(`[widget] widget with key '${this.key}' is already attached (did you attached two components to the same widget? did you forgot to detach the widget upon ngOnDestroy?)`);
        }else {
            console.log(`[widget] widget '${this.key}': attaching widget`);
            this.updateState({isAttached: true});
            this.activate();
        }
    }

    public detachForm() : void{

        this._verifyRegistered();

        if (!this.isAttached) {
            console.warn(`[widget] widget with key '${this.key}' is already detached (did you attached two components to the same widget? did you forgot to attach the widget upon ngOnInit?)`);
        }else {
            console.log(`[widget] widget '${this.key}': detaching widget`);
            this.updateState({isAttached: false});
        }
    }

    destory() {
        this._reset();
        this._widgetReset.complete();
    }

}