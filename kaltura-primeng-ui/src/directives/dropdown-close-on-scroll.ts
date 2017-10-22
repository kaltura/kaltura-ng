import { Directive, OnDestroy, AfterViewInit, ContentChild, Input } from '@angular/core';
import { Dropdown } from 'primeng/primeng';

@Directive({
	selector: '[kDropdownCloseOnScroll]',
})
export class DropdownCloseOnScroll implements AfterViewInit, OnDestroy {

	@Input() scrollTarget: any;
	@ContentChild(Dropdown) public dropdown: Dropdown;

	constructor() {
	}

	ngAfterViewInit() {
		if (this.scrollTarget){
			this.scrollTarget.addEventListener('scroll', this.closeDropdown.bind(this));

		}
	}

	ngOnDestroy() {
		if (this.scrollTarget) {
			this.scrollTarget.removeEventListener('scroll', this.closeDropdown.bind(this));
		}
	}

	private closeDropdown():void{
		if (this.dropdown && typeof this.dropdown.hide !== "undefined"){
			this.dropdown.hide();
		}
	}
}
