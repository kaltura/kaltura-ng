import { Observable } from 'rxjs';
import { TeardownLogic } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';
import { Operator } from 'rxjs/Operator';
import {OperationTagStoreMediator} from "../../../operation-tag/operation-tag-store-mediator";


export function _tag<T>(this: Observable<T>, action : string): Observable<T> {
    return this.lift(new tagOperator(action));
}

class tagOperator<T> implements Operator<T, T> {


    constructor(private tag : string) {
    }

    call(subscriber: Subscriber<T>, source: any): TeardownLogic {
        return source.subscribe(new TagSubscriber(subscriber, this.tag));
    }
}

class TagSubscriber<T> extends Subscriber<T> {

    private isDecreased = false;

    constructor(destination: Subscriber<T>,
                private tag : string) {
        super(destination);

        // console.log(`(tag: '${tag}'): subscribe()`);

        OperationTagStoreMediator.increase(this.tag);
    }


    protected _error(err: any) {
        if (this.tag && !this.isDecreased)
        {
            // console.log(`(tag: '${this.tag}'): error()`);

            this.isDecreased =true;
            OperationTagStoreMediator.decrease(this.tag);
        }
        super._error(err);
    }

    protected _complete() {
        if (this.tag && !this.isDecreased)
        {
            // console.log(`(tag: '${this.tag}'): complete()`);

            this.isDecreased =true;
            OperationTagStoreMediator.decrease(this.tag);
        }
        super._complete();
    }

    unsubscribe()
    {
        if (!this.closed && this.tag && !this.isDecreased) {
            // console.log(`(tag: '${this.tag}'): unsubscribe()`);
            this.isDecreased =true;
            OperationTagStoreMediator.decrease(this.tag);
        }

        super.unsubscribe();
    }
}
