import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StickyScrollService implements OnDestroy
{
	private _scrollSubject = new Subject<{}>();
	public scrollStatus$ = this._scrollSubject.asObservable();
	constructor()
	{
		window.addEventListener('scroll', this.manageScrollEvent.bind(this));
	}

	ngOnDestroy(){
		window.removeEventListener('scroll', this.manageScrollEvent.bind(this));
	}

	manageScrollEvent(event){
		this._scrollSubject.next({});
	}
}
