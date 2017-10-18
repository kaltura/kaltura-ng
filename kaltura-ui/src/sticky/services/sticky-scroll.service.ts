import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StickyScrollService implements OnDestroy
{
	private _scrollSubject = new Subject<{}>();
	public scrollStatus$ = this._scrollSubject.asObservable();
	private _resizeSubject = new Subject<{}>();
	public resizeStatus$ = this._resizeSubject.asObservable();

	constructor()
	{
		window.addEventListener('scroll', this.manageScrollEvent.bind(this));
		window.addEventListener('resize', this.manageResizeEvent.bind(this));
	}

	ngOnDestroy(){
		window.removeEventListener('scroll', this.manageScrollEvent.bind(this));
		window.removeEventListener('resize', this.manageResizeEvent.bind(this));
	}

	manageScrollEvent(){
		this._scrollSubject.next({});
	}

	manageResizeEvent(){
		this._resizeSubject.next({});
	}
}
