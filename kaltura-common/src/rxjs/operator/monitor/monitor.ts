import { Observable } from 'rxjs/Observable';
import { TeardownLogic } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';
import { Operator } from 'rxjs/Operator';
import { FriendlyHashId } from '../../../friendly-hash-id';
import { KalturaLogger, KalturaDefaultLogger } from '@kaltura-ng/kaltura-logger';

export function _monitor<T>(this: Observable<T>, action : string, context? : any): Observable<T> {
    return this.lift(new monitorOperator(action,context));
}

class monitorOperator<T> implements Operator<T, T> {
    constructor(private action : string, private context? : any) {

    }

    call(subscriber: Subscriber<T>, source: any): TeardownLogic {

        return source.subscribe(new MonitorSubscriber(subscriber, this.action, this.context));
    }
}

class MonitorSubscriber<T> extends Subscriber<T> {

    private actionId : string;
    private enabled: boolean;
    private logger = KalturaDefaultLogger.get();

    constructor(destination: Subscriber<T>,
                private action : string, private context? : any) {
        super(destination);

        this.enabled = !!action && !!this.logger;

        if (this.enabled) {
            this.actionId = FriendlyHashId.generate();
            //this.logger.debug(`(#${this.actionId}) ${this.action}: subscribe()`, context);
            this.logger.debug(`(#${this.actionId}) ${this.action}: subscribe()`);
        }
    }

    protected _next(value: T) {
        if (this.enabled)
        {
            this.logger.info(`(#${this.actionId}) ${this.action}: .next()`);
            //this.logger.info(`(#${this.actionId}) ${this.action}: .next()`,value);
        }
        super._next(value);
    }

    protected _error(err: any) {
        if (this.enabled)
        {
            this.logger.info(`(#${this.actionId}) ${this.action}: error()`,err);
        }
        super._error(err);
    }

    protected _complete() {
        if (this.enabled)
        {
            this.logger.debug(`(#${this.actionId}) ${this.action}: .complete()`);
        }
        super._complete();
    }

    unsubscribe()
    {
        if (this.enabled && !this.closed) {
            this.logger.debug(`(#${this.actionId}) ${this.action}: unsubscribe()`);
        }

        super.unsubscribe();
    }
}