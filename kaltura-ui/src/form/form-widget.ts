import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/of';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import 'rxjs/add/operator/catch';
import { FormManager } from './form-manager';
import { ISubscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';

export declare type FormWidgetState = { key : string, isActive : boolean,  isValid : boolean, isDirty : boolean, isBusy : boolean, isAttached : boolean, wasActivated : boolean };


export abstract class FormWidget<TData, TRequest> implements OnDestroy
{
    public get data(): TData {
        return this._data;
    }

    // DEVELOPER NOTE: this class cannot use 'cancelOnDestroy' operation
    // because it must assume the inheriter will override it
    private _activateSubscription: ISubscription = null;



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

    protected updateState(stateUpdate : Partial<FormWidgetState>) : void {
        const stateHasChanges = Object.keys(stateUpdate).reduce((result, propertyName) => result || this._widgetState[propertyName] !== stateUpdate[propertyName], false);

        if (stateHasChanges) {
            Object.assign(this._widgetState, stateUpdate);

            if (this._manager) {
                const newWidgetState = Object.assign({}, this._widgetState);
                this._manager._updateWidgetState(newWidgetState);
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
        this._verifyRegistered();

        this.data = null;
        this._onDataLoading(dataId);
    }

    public onDataLoaded(data: TData): void {

        this._verifyRegistered();

        this.data = data;
        this._onDataLoaded(data);
    }

    public validate(): Observable<{isValid: boolean}> {

        this._verifyRegistered();

        if (this.wasActivated) {
            return this._onValidate();
        }else {
            return Observable.of({isValid : true});
        }
    }

    public onDataSaving(newData: TData, request: TRequest, originalData: TData): void {

        this._verifyRegistered();

        if (this.wasActivated) {
            this._onDataSaving(newData, request, originalData);
        }
    }

    public reset(): void {
        this._verifyRegistered();

        console.log(`[form widget] widget ${this.key}: reset widget`);

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
        if(!this._manager)
        {
            throw new Error('This widget ')
        }
    }

    public activate(): void {

        this._verifyRegistered();

        if (this.data && this.isAttached && !this.isActive) {

            this.reset();

            const previousStatus = {
              wasActivated : this.wasActivated
            };
            const activate$ = this._onActivate(!this.wasActivated);

            // update status
            console.log(`[form widget] widget ${this.key}: activated widget (first time = ${!previousStatus.wasActivated})`);
            this.updateState({ isActive : true, isBusy : true, wasActivated : true});

            if (activate$ instanceof Observable) {
                console.log(`[form widget] widget ${this.key}: widget provided async activation operation. executing async activation.`);
                this._activateSubscription = activate$
                    .monitor(`[form widget] widget ${this.key}: activate widget (first time = ${!previousStatus.wasActivated})`)
                    .catch((error, caught) => Observable.of({failed: true, error}))
                    .subscribe(
                        response => {
                            if (response && response.failed) {
                                console.log(`[form widget] widget ${this.key}: async widget activation failed. revert status to ${JSON.stringify(previousStatus)})`);
                                this.updateState({ isActive : false, isBusy : false, wasActivated : previousStatus.wasActivated});
                            }else {
                                console.log(`[form widget] widget ${this.key}: async widget activation completed`);
                                this.updateState({ isBusy : false });
                            }
                        },
                        () => {
                            this._activateSubscription = null;
                        },
                        () => {
                            this._activateSubscription = null;
                        });
            } else {
                console.log(`[form widget] widget ${this.key}: activated widget (first time = ${!previousStatus.wasActivated})`);
                this.updateState({ isBusy : false });
            }
        }
    }


    public attachForm() : void{
        this._verifyRegistered();

        if (this.isAttached) {
            console.warn(`[form widget] widget with key '${this.key}' is already attached (did you attached two components to the same widget? did you forgot to detach the widget upon ngOnDestroy?)`);
        }else {
            this.updateState({isAttached: true});
            this.activate();
        }
    }

    ngOnDestroy()
    {
        // DEVELOPER NOTE: Don't add logic here - it would probably the inheritor will
        // probably override this without calling super()
    }

    public detachForm() : void{

        this._verifyRegistered();

        if (!this.isAttached) {
            console.warn(`[form widget] widget with key '${this.key}' is already detached (did you attached two components to the same widget? did you forgot to attach the widget upon ngOnInit?)`);
        }else {
            this.updateState({isAttached: false});
        }
    }

    destory() {
        this.reset();
        this._widgetReset.complete();
    }

}