import { Observable } from 'rxjs/Observable';
import { _cancelOnDestroy as cancelOnDestroy } from '../operator/cancel-on-destroy/cancel-on-destroy';
import { _monitor as monitor } from '../operator/monitor/monitor';

Observable.prototype.cancelOnDestroy = cancelOnDestroy;
Observable.prototype.monitor = monitor;

declare module 'rxjs/Observable' {
    interface Observable<T> {
        monitor: typeof monitor;
    }
    interface Observable<T> {
        cancelOnDestroy: typeof cancelOnDestroy;
    }
}

