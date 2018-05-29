import { Observable } from 'rxjs/Observable';
import { TeardownLogic, ISubscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import { Operator } from 'rxjs/Operator';
import { OnDestroy } from '@angular/core';
import 'rxjs/add/observable/merge';

interface EnhancedOnDestroy extends OnDestroy
{
    __ngOnDestroySource__ : Subject<string>;
    __ngOnDestroy__ : () => void;
}

export function _cancelOnDestroy<T>(this: Observable<T>, instance : OnDestroy, manualDestroy? : Observable<any>): Observable<T> {
    return this.lift(new CancelOnDestroyOperator(instance,manualDestroy));
}

class CancelOnDestroyOperator<T> implements Operator<T, T> {
    constructor(private instance: OnDestroy,  private manualDestroy? : Observable<any>) {
        if (instance.ngOnDestroy) {
            if (!(<any>instance).__ngOnDestroySource__) {
                (<any>instance).__ngOnDestroySource__ = new Subject();
                (<any>instance).__ngOnDestroy__ = instance.ngOnDestroy;

                instance.ngOnDestroy = function (this: EnhancedOnDestroy) {

                    this.__ngOnDestroy__.apply(this, arguments);
                    this.__ngOnDestroySource__.next();
                    this.__ngOnDestroySource__.complete();
                };
            }
        }
    }

    call(subscriber: Subscriber<T>, source: any): TeardownLogic {

        return source.subscribe(new CancelOnDestroySubscriber(subscriber, <EnhancedOnDestroy>this.instance, this.manualDestroy));
    }
}

class CancelOnDestroySubscriber<T> extends Subscriber<T> {
    constructor(destination: Subscriber<T>,
                private _instance: EnhancedOnDestroy,
                private manualDestroy? : Observable<any>) {
        super(destination);

        const sources = manualDestroy ? Observable.merge(manualDestroy, _instance.__ngOnDestroySource__) :  _instance.__ngOnDestroySource__.asObservable();

        this.add(sources.subscribe(
            () => {
                destination.unsubscribe();
            }
        ));
    }
}
