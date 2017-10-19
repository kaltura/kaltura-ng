import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StickyScrollService implements OnDestroy
{
	private _scrollSubject = new Subject<{}>();
	public scrollStatus$ = this._scrollSubject.asObservable();
	private _resizeSubject = new Subject<{}>();
	public resizeStatus$ = this._resizeSubject.asObservable();
	private _layoutSubject = new BehaviorSubject<{}>({});
	public layoutSubject$ = this._layoutSubject.asObservable();

	private stickyElements: any = {};

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

	attach(id: string){
		if (!id){
			console.warn("sticky service::missing id on attach!");
		}else if (typeof this.stickyElements[id] !== "undefined") {
			console.warn("sticky service::id already exists! ("+id+")");
		}else{
			this.stickyElements[id] = null;
		}
	}

	detach(id: string){
		if (!id){
			console.warn("sticky service::missing id on attach!");
		}else {
			delete this.stickyElements[id];
		}
	}

	update(id: string, height: number, offset: number){
		if (!id){
			console.warn("sticky service::missing id on attach!");
		}else {
			const currentValue = this.stickyElements[id];
			if (!currentValue || (currentValue.height !== height || currentValue.offset !== offset)) {
				this.stickyElements[id] = {height, offset};
				this._layoutSubject.next(this.stickyElements);
			}
		}
	}
}
