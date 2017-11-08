import { Observable } from 'rxjs/Observable';
import { _cancelOnDestroy as cancelOnDestroy } from '../operator/cancel-on-destroy/cancel-on-destroy';
import { _monitor as monitor } from '../operator/monitor/monitor';
import { _tag as tag } from '../operator/tag/tag';

Observable.prototype.cancelOnDestroy = cancelOnDestroy;
Observable.prototype.monitor = monitor;
Observable.prototype.tag = tag;

declare module 'rxjs/Observable' {
    interface Observable<T> {
        monitor: typeof monitor;
    }
    interface Observable<T> {
        cancelOnDestroy: typeof cancelOnDestroy;
    }
    interface Observable<T> {
        tag: typeof tag;
    }
}

