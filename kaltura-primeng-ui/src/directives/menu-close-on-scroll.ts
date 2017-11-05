import { Directive, ContentChild, HostListener } from '@angular/core';
import { Menu } from 'primeng/primeng';

@Directive({
	selector: '[kMenuCloseOnScroll]',
})
export class MenuCloseOnScroll {

	@ContentChild(Menu) public menu: Menu;

	constructor() {
	}

	@HostListener("window:scroll", [])
	onWindowScroll() {
		this.closeMenu();
	}

	private closeMenu():void{
		if (this.menu && typeof this.menu.hide !== "undefined"){
			this.menu.hide();
		}
	}
}
