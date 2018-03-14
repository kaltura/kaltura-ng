import { Directive, OnDestroy, AfterViewInit, ContentChild, Input } from '@angular/core';
import { Dropdown } from 'primeng/primeng';
import { ISubscription } from 'rxjs/Subscription';

@Directive({
	selector: '[kDropdownCloseOnScroll]',
})
export class DropdownCloseOnScroll implements AfterViewInit, OnDestroy {

	@Input() scrollTarget: any;
	@ContentChild(Dropdown) public dropdown: Dropdown;

	private _registered = false;
	private _dropdownChangesSubscription: ISubscription;
	private _closeDropdownFunc = this.closeDropdown.bind(this);
	private _isDestroyed = false;

	constructor() {
	}

	ngAfterViewInit() {
		this.dropdown.el.nativeElement.addEventListener('click', ()=>{
			this.handleScrollRegistration();
		});
		this._dropdownChangesSubscription = this.dropdown.onChange.subscribe((event) => {
			this.handleScrollRegistration();
		});
	}

	handleScrollRegistration():void{
		if (this.scrollTarget && this.dropdown){
			setTimeout(()=>{
				if (!this._isDestroyed) {
					if (this.dropdown.panelVisible && !this._registered) {
						this.scrollTarget.addEventListener('scroll', this._closeDropdownFunc);
						this._registered = true;
					}
					if (!this.dropdown.panelVisible && this._registered) {
						this.scrollTarget.removeEventListener('scroll', this._closeDropdownFunc);
						this._registered = false;
					}
				}
			},0);
		}
	}

	ngOnDestroy() {
		if (this.scrollTarget && this._registered) {
			this.scrollTarget.removeEventListener('scroll', this._closeDropdownFunc);
		}
		if (this._dropdownChangesSubscription){
			this._dropdownChangesSubscription.unsubscribe();
			this._dropdownChangesSubscription = null;
		}
		this._isDestroyed = true;
	}

	private closeDropdown():void{
		if (this.dropdown && typeof this.dropdown.hide !== "undefined"){
			this.dropdown.hide();
			this.scrollTarget.removeEventListener('scroll', this._closeDropdownFunc);
			this._registered = false;
		}
	}
}
