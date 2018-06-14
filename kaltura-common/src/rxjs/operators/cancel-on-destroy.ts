import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { OnDestroy } from '@angular/core';
import 'rxjs/add/observable/merge';

interface EnhancedOnDestroy extends OnDestroy {
    __ngOnDestroySource__: Subject<string>;
    __ngOnDestroy__: () => void;
}

export function cancelOnDestroy<T>(instance: OnDestroy, manualDestroy?: Observable<any>): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => {
        if (instance.ngOnDestroy) {
            return Observable.create(observer => {
                let subscription = source.subscribe(observer);
                
                if (!(<EnhancedOnDestroy>instance).__ngOnDestroySource__) {
                    (<EnhancedOnDestroy>instance).__ngOnDestroySource__ = new Subject();
                    (<EnhancedOnDestroy>instance).__ngOnDestroy__ = instance.ngOnDestroy;
                    
                    instance.ngOnDestroy = function (this: EnhancedOnDestroy) {
                        this.__ngOnDestroy__.apply(this, arguments);
                        this.__ngOnDestroySource__.next();
                        this.__ngOnDestroySource__.complete();
                    };
                }
                
                const sources = manualDestroy
                    ? Observable.merge(manualDestroy, (<EnhancedOnDestroy>instance).__ngOnDestroySource__)
                    : (<EnhancedOnDestroy>instance).__ngOnDestroySource__.asObservable();
                
                sources.subscribe(() => {
                    if (subscription) {
                        subscription.unsubscribe();
                        subscription = null;
                    }
                });
                
                return () => {
                    if (subscription) {
                        subscription.unsubscribe();
                        subscription = null;
                    }
                }
            });
        } else {
            return source;
        }
    }
}