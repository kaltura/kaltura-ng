import { Observable } from 'rxjs';
import { _cancelOnDestroy as cancelOnDestroy } from '../operator/cancel-on-destroy/cancel-on-destroy';
import { _tag as tag } from '../operator/tag/tag';

(Observable as any).prototype.cancelOnDestroy = cancelOnDestroy;
(Observable as any).prototype.tag = tag;

declare module 'rxjs/internal/Observable' {
    interface Observable<T> {
        cancelOnDestroy: typeof cancelOnDestroy;
    }
    interface Observable<T> {
        tag: typeof tag;
    }
}

