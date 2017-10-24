import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { StickyScrollService } from '../services/sticky-scroll.service';

@Component({
	selector: 'kScrollToTop',
	templateUrl: './scroll-to-top.component.html',
	styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit, OnDestroy{

	@Input() scrollOffset = 0;
	@Input() scrollDuration = 500;

	public _show = false;
	private scrolling = false;

	constructor(private _stickyScrollService: StickyScrollService) {}

	ngOnInit(): void {
		this._stickyScrollService.scrollStatus$.cancelOnDestroy(this).subscribe(
			event => {
				this._show = (window.pageYOffset > this.scrollOffset);
			}
		);
	}

	ngOnDestroy(){

	}

	scrollToTop():void{
		if (!this.scrolling){
			this.scrolling = true;
			const cosParameter = window.pageYOffset / 2;
			let scrollCount: number = 0;
			let oldTimestamp: number = performance.now();
			const step = newTimestamp => {
				scrollCount += Math.PI / (this.scrollDuration / (newTimestamp - oldTimestamp));
				if (scrollCount >= Math.PI) window.scrollTo(0, 0);
				if (window.pageYOffset === 0) {
					this.scrolling = false;
					return;
				}
				window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
				oldTimestamp = newTimestamp;
				window.requestAnimationFrame(step);
			};
			window.requestAnimationFrame(step);
		}
	}
}

