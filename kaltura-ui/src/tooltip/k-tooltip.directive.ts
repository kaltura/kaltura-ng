import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';

export type TooltipPositions = 'top' | 'left' | 'right' | 'bottom';

@Directive({
	selector: '[kTooltip]'
})
export class KTooltipDirective implements OnDestroy{

	constructor(private elementRef: ElementRef) {
	}

	private _tooltip: any = null;

	@Input() tooltipOffset: number = 8;
	@Input() kTooltip = "";
	@Input() placement: TooltipPositions = "top";
	@Input() delay = 0;
	@Input() maxWidth: number = 0;

	@HostListener("mouseenter") onMouseEnter() {
		if (this._tooltip === null && this.kTooltip && this.kTooltip.length) {
			document.body.appendChild(this.createElem());
			this.setPosition();
		}
	}

	@HostListener("mouseleave") removeTooltip() {
		if (this._tooltip) {
			this._tooltip.parentNode.removeChild(this._tooltip);
			this._tooltip = null;
		}
	}

	createElem() {
		this._tooltip = document.createElement('span');
		this._tooltip.className += "ng-tooltip ng-tooltip-" + this.placement;
		if (this.maxWidth > 0){
			this._tooltip.style.maxWidth = this.maxWidth + "px";
			this._tooltip.style.textAlign = "left";
		}
		this._tooltip.textContent = this.kTooltip;
		setTimeout(() => {
			if (this._tooltip) {
				this._tooltip.className += " ng-tooltip-show";
			}
		}, this.delay);

		return this._tooltip;
	}

	setPosition() {

		const elemPosition = this.elementRef.nativeElement.getBoundingClientRect();

		let elemHeight = this.elementRef.nativeElement.offsetHeight;
		let elemWidth = this.elementRef.nativeElement.offsetWidth;
		let tooltipHeight = this._tooltip.clientHeight;
		let tooltipWidth = this._tooltip.offsetWidth;

		if (this.placement == 'top') {
			this._tooltip.style.top = elemPosition.top - (tooltipHeight + this.tooltipOffset) + 'px';
		}

		if (this.placement == 'bottom') {
			this._tooltip.style.top = elemPosition.top + elemHeight + this.tooltipOffset + 'px';
		}

		if (this.placement == 'top' || this.placement == 'bottom') {
			this._tooltip.style.left = (elemPosition.left + elemWidth / 2) - tooltipWidth / 2 + 'px';
		}

		if (this.placement == 'left') {
			this._tooltip.style.left = elemPosition.left - tooltipWidth - this.tooltipOffset + 'px';
		}

		if (this.placement == 'right') {
			this._tooltip.style.left = elemPosition.left + elemWidth + this.tooltipOffset + 'px';
		}

		if (this.placement == 'left' || this.placement == 'right') {
			this._tooltip.style.top = elemPosition.top + elemHeight / 2 - this._tooltip.clientHeight / 2 + 'px';
		}
	}

	ngOnDestroy(){
		this.removeTooltip();
	}
}
