import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {OperationTagManagerProxy} from './operation-tag-store-mediator';

@Injectable()
export class OperationTagManagerService implements OperationTagManagerProxy {

    private _tagStatus = new BehaviorSubject<{ [key: string]: number }>({});

    // whenever a tag status changes this event is emitted
    public tagStatus$ = this._tagStatus.asObservable();

    constructor() {
    }

    // increase the count for a tag
    increase(tag: string): void {
        const tagsData = this._tagStatus.getValue();
        if (!tagsData[tag]) {
            tagsData[tag] = 0;
        }
        tagsData[tag]++;
        this._tagStatus.next(tagsData);

    }

    decrease(tag: string): void {
        const tagsData = this._tagStatus.getValue();
        if (tagsData[tag]) {
            tagsData[tag]--;
            this._tagStatus.next(tagsData);
        }
    }
}
