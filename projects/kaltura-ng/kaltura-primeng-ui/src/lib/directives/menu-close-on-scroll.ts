import { Directive, ContentChild, HostListener, Input, Optional } from '@angular/core';
import { Menu, TieredMenu } from 'primeng/primeng';

@Directive({
	selector: '[kMenuCloseOnScroll]',
})
export class MenuCloseOnScroll {
	private  _menu: Menu | TieredMenu;

	constructor(@Optional() menu: Menu, @Optional() tieredMenu: TieredMenu)
	{
        this._menu = menu || tieredMenu;
	}

	@HostListener("window:scroll", [])
	onWindowScroll() {
		this.closeMenu();
	}

	private closeMenu():void {
        if (this._menu && typeof this._menu.hide !== "undefined") {
            this._menu.hide();
        }
    }
}
