import { Observable } from 'rxjs/Observable';
import { TeardownLogic } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';
import { Operator } from 'rxjs/Operator';
import { FriendlyHashId } from '../../../friendly-hash-id';


export function _monitor<T>(this: Observable<T>, action : string, context? : any): Observable<T> {
    return this.lift(new monitorOperator(action,context));
}

class monitorOperator<T> implements Operator<T, T> {
    constructor(private action : string, private context? : any) {

    }

    call(subscriber: Subscriber<T>, source: any): TeardownLogic {

        return source.subscribe(new monitorSubscriber(subscriber, this.action, this.context));
    }
}

class monitorSubscriber<T> extends Subscriber<T> {

    private actionId : string;
    constructor(destination: Subscriber<T>,
                private action : string, private context? : any) {
        super(destination);

        this.actionId = FriendlyHashId.generate();
        console.debug(`(#${this.actionId}) ${this.action}: subscribe()`, context);
    }

    protected _next(value: T) {
        if (this.action)
        {
            console.log(`(#${this.actionId}) ${this.action}: .next()`,value);
        }
        super._next(value);
    }

    protected _error(err: any) {
        if (this.action)
        {
            console.log(`(#${this.actionId}) ${this.action}: error()`,err);
        }
        super._error(err);
    }

    protected _complete() {
        if (this.action)
        {
            console.debug(`(#${this.actionId}) ${this.action}: .complete()`);
        }
        super._complete();
    }

    unsubscribe()
    {
        if (!this.closed) {
            console.debug(`(#${this.actionId}) ${this.action}: unsubscribe()`);
        }

        super.unsubscribe();
    }
}