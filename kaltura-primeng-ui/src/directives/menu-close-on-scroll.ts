import { Directive, ContentChild, HostListener, Input } from '@angular/core';
import { Menu } from 'primeng/primeng';

@Directive({
	selector: '[kMenuCloseOnScroll]',
})
export class MenuCloseOnScroll {
	@Input() menu: Menu;

	@ContentChild(Menu) public currentMenu: Menu;

	constructor() {
	}

	@HostListener("window:scroll", [])
	onWindowScroll() {
		this.closeMenu();
	}

	private closeMenu():void{
    const menu = this.menu || this.currentMenu;
		if (menu && typeof menu.hide !== "undefined"){
      menu.hide();
		}
	}
}
