import {MonoTypeOperatorFunction, Observable, Operator, Subscriber, TeardownLogic} from "rxjs";
import {OperationTagStoreMediator} from "../../operation-tag/operation-tag-store-mediator";

export function tag<T>(action): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => source.lift(new TagOperator(action));
}

class TagOperator<T> implements Operator<T, T> {
  constructor(private _tag: string) {
  }

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(new TagSubscriber(subscriber, this._tag));
  }
}

class TagSubscriber<T> extends Subscriber<T> {
  private _isDecreased = false;

  constructor(destination: Subscriber<T>,
              private _tag: string) {
    super(destination);

    OperationTagStoreMediator.increase(this._tag);
  }


  protected _error(err: any) {
    if (this._tag && !this._isDecreased) {

      this._isDecreased = true;
      OperationTagStoreMediator.decrease(this._tag);
    }
    super._error(err);
  }

  protected _complete() {
    if (this._tag && !this._isDecreased) {
      this._isDecreased = true;
      OperationTagStoreMediator.decrease(this._tag);
    }
    super._complete();
  }

  unsubscribe() {
    if (!this.closed && this._tag && !this._isDecreased) {
      this._isDecreased = true;
      OperationTagStoreMediator.decrease(this._tag);
    }

    super.unsubscribe();
  }
}
