import { Observable } from 'rxjs/Observable';
import { OperationTagStoreMediator } from '../../operation-tag/operation-tag-store-mediator';

export function tag<T>(action: string): (source: Observable<T>) => Observable<T> {
    let isDecreased = false;
    let closed = false;
    
    return (source: Observable<T>) => Observable.create(observer => {
        OperationTagStoreMediator.increase(action);

        let subscription = source.subscribe(
            (value) => {
                observer.next(value);
            },
            error => {
                if (action && !isDecreased) {
                    isDecreased = true;
                    OperationTagStoreMediator.decrease(action);
                }
                observer.error(error);
            },
            () => {
                if (action && !isDecreased) {
                    isDecreased = true;
                    OperationTagStoreMediator.decrease(action);
                }
                observer.complete();
            }
        );
        
        return () => {
            if (!closed && action && !isDecreased) {
                isDecreased = true;
                OperationTagStoreMediator.decrease(action);
            }
            
            if (subscription) {
                subscription.unsubscribe();
                subscription = null;
                closed = true;
            }
        }
    });
}