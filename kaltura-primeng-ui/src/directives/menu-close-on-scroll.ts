import { Directive, OnDestroy, AfterViewInit, ContentChild, Input } from '@angular/core';
import { Menu } from 'primeng/primeng';

@Directive({
	selector: '[kMenuCloseOnScroll]',
})
export class MenuCloseOnScroll implements AfterViewInit, OnDestroy {

	@Input() scrollTarget: any;
	@ContentChild(Menu) public menu: Menu;

	constructor() {
	}

	ngAfterViewInit() {
		if (this.scrollTarget) {
			this.scrollTarget.addEventListener('scroll', this.closeMenu.bind(this));
		}

	}

	ngOnDestroy() {
		if (this.scrollTarget) {
			this.scrollTarget.removeEventListener('scroll', this.closeMenu.bind(this));
		}
	}

	private closeMenu():void{
		if (this.menu && typeof this.menu.hide !== "undefined"){
			this.menu.hide();
		}
	}
}
