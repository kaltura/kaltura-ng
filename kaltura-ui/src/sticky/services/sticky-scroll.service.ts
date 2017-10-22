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
	private manageScrollFunc = this.manageScrollEvent.bind(this);
	private manageResizeFunc = this.manageResizeEvent.bind(this);

	constructor()
	{
		window.addEventListener('scroll', this.manageScrollFunc);
		window.addEventListener('resize', this.manageResizeFunc);
	}

	ngOnDestroy(){
		window.removeEventListener('scroll', this.manageScrollFunc);
		window.removeEventListener('resize', this.manageResizeFunc);
	}

	manageScrollEvent(){
		this._scrollSubject.next({});
	}

	manageResizeEvent(){
		this._resizeSubject.next({});
	}

	attach(id: string){
		if (!id){
			throw new Error("sticky service::missing id on attach!");
		}else if (typeof this.stickyElements[id] !== "undefined") {
			throw new Error("sticky service::id already exists! ("+id+")");
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
			console.warn("sticky service::missing id!");
		}else {
			const currentValue = this.stickyElements[id];
			if (typeof currentValue !== "undefined") {
				if (currentValue === null || currentValue.height !== height || currentValue.offset !== offset) {
					this.stickyElements[id] = {height, offset};
					this._layoutSubject.next(this.stickyElements);
				}
			} else {
				throw new Error(`unknown sticky element '${id}' (did you attach it before updating?)`);
			}
		}
	}
}
