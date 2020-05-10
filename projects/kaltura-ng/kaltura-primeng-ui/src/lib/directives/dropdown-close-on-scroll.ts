import { Directive, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';
import { ISubscription } from 'rxjs/Subscription';

@Directive({
	selector: '[kDropdownCloseOnScroll]',
})
export class DropdownCloseOnScroll implements AfterViewInit, OnDestroy {

	@Input() scrollTarget: any;
  @Input() dropdownComponent: Dropdown;

	private _registered = false;
	private _dropdownChangesSubscription: ISubscription;
	private _closeDropdownFunc = this.closeDropdown.bind(this);
	private _isDestroyed = false;

	constructor() {
	}

	ngAfterViewInit() {
		this.dropdownComponent.el.nativeElement.addEventListener('click', ()=>{
			this.handleScrollRegistration();
		});
		this._dropdownChangesSubscription = this.dropdownComponent.onChange.subscribe((event) => {
			this.handleScrollRegistration();
		});
	}

	handleScrollRegistration():void{
		if (this.scrollTarget && this.dropdownComponent){
			setTimeout(()=>{
				if (!this._isDestroyed) {
					if (this.dropdownComponent.overlayVisible && !this._registered) {
						this.scrollTarget.addEventListener('scroll', this._closeDropdownFunc);
						this._registered = true;
					}
					if (!this.dropdownComponent.overlayVisible && this._registered) {
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

	private closeDropdown(event):void{
		if (this.dropdownComponent && typeof this.dropdownComponent.hide !== "undefined"){
			this.dropdownComponent.hide(event);
			this.scrollTarget.removeEventListener('scroll', this._closeDropdownFunc);
			this._registered = false;
		}
	}
}
