import {merge, MonoTypeOperatorFunction, Observable, Operator, Subject, Subscriber, TeardownLogic} from "rxjs";
import {OnDestroy} from "@angular/core";

const __ngOnDestroySource__ = Symbol("__ngOnDestroySource__");
const __ngOnDestroy__ = Symbol("__ngOnDestroy__");

interface EnhancedOnDestroy extends OnDestroy {
  [__ngOnDestroySource__]: Subject<string>;
  [__ngOnDestroy__]: () => void;
}

export function cancelOnDestroy<T>(instance: OnDestroy,
                                   manualDestroy?: Observable<any>): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => source.lift(new CancelOnDestroyOperator(instance, manualDestroy));
}

class CancelOnDestroyOperator<T> implements Operator<T, T> {
  constructor(private instance: OnDestroy, private manualDestroy?: Observable<any>) {
    if (instance.ngOnDestroy) {
      if (!(<EnhancedOnDestroy>instance)[__ngOnDestroySource__]) {
        (<EnhancedOnDestroy>instance)[__ngOnDestroySource__] = new Subject();
        (<EnhancedOnDestroy>instance)[__ngOnDestroy__] = instance.ngOnDestroy;

        instance.ngOnDestroy = function (this: EnhancedOnDestroy) {

          this[__ngOnDestroy__].apply(this, arguments);
          this[__ngOnDestroySource__].next();
          this[__ngOnDestroySource__].complete();
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
              private manualDestroy?: Observable<any>) {
    super(destination);

    const sources = manualDestroy
      ? merge(manualDestroy, _instance[__ngOnDestroySource__])
      : _instance[__ngOnDestroySource__].asObservable();

    this.add(sources.subscribe(
      () => {
        destination.unsubscribe();
      }
    ));
  }
}
