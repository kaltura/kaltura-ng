import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';

export type TooltipPositions = 'top' | 'left' | 'right' | 'bottom';

@Directive({
	selector: '[kTooltip]'
})
export class KTooltipDirective implements OnDestroy {

    constructor(private elementRef: ElementRef) {
    }

    private _tooltipElement: HTMLElement = null;
    private _tooltipContent: any = null;
    private _shouldBeVisible = false;
    private _tooltipHeight: number = null;
    private _tooltipWidth: number = null;

    @Input() tooltipResolver: (val: any) => string = null;
    @Input() escape: boolean = true;
    @Input() tooltipOffset: number = 8;
    @Input() placement: TooltipPositions = "top";
    @Input() delay = 0;
    @Input() maxWidth: number = 0;
    @Input() followTarget = false;

    @Input()
    set kTooltip(value: any) {
        if (typeof value === 'undefined' || value === '' || value === null) {
            this._tooltipContent = null;
        }
        else {
            this._tooltipContent = value;
        }

        this._updateTooltipElement();
    }
    
    private _updateTooltipElement(): void {
        if (!this._tooltipContent) {
            if (this._isShowingTooltip()) {
                this._removeTooltipElement();
            }
        } else if (this._shouldBeVisible) {
            if (!this._isShowingTooltip()) {
                this._tooltipElement = document.createElement('span');
                this._tooltipElement.style.pointerEvents = 'none';
                this._tooltipElement.className += "ng-tooltip ng-tooltip-" + this.placement;
                if (this.maxWidth > 0) {
                    this._tooltipElement.style.maxWidth = this.maxWidth + "px";
                }

                const addTooltipVisibleClass = () => {
                    if (this._tooltipElement) {
                        this._tooltipElement.className += " ng-tooltip-show";
                    }
                };

                if (this.delay) {
                    setTimeout(addTooltipVisibleClass, this.delay);
                } else {
                    addTooltipVisibleClass();
                }

                document.body.appendChild(this._tooltipElement);
                this._updateTooltipElementContent();
                this._updateTooltipElementPosition();

            } else {
                this._updateTooltipElementContent();
                this._updateTooltipElementPosition();
            }
        } else {
            if (this._isShowingTooltip()) {
                this._removeTooltipElement();
            }
        }
    }

    @HostListener("mousemove")
    onMouseMove() {
        if (this.followTarget) {
            this._updateTooltipElementPosition();
        }
    }

    @HostListener("mouseenter")
    onMouseEnter() {
    	this._shouldBeVisible = true;
    	this._updateTooltipElement();
    }

    @HostListener("mouseleave")
    onMouseLeave() {
        this._shouldBeVisible = false;
        this._updateTooltipElement();
    }

    private _removeTooltipElement() {
        if (this._tooltipElement) {
            if (this._tooltipElement.parentNode) {
                this._tooltipElement.parentNode.removeChild(this._tooltipElement);
            }
            this._tooltipElement = null;
            this._tooltipHeight = null;
            this._tooltipWidth = null;
        }
    }

    private _isShowingTooltip(): boolean {
        return this._tooltipElement !== null;
	}

    private _updateTooltipElementContent() {
        if (this._isShowingTooltip() && this._tooltipContent) {

            const content = this.tooltipResolver ? this.tooltipResolver(this._tooltipContent) : String(this._tooltipContent);

            if (this.escape) {
                this._tooltipElement.innerHTML = '';
                this._tooltipElement.textContent = content;
            } else {
                this._tooltipElement.innerHTML = content;
                this._tooltipElement.textContent = '';
            }

            this._tooltipHeight = this._tooltipElement.clientHeight;
            this._tooltipWidth = this._tooltipElement.offsetWidth;
        }
    }

    private _updateTooltipElementPosition() {

        if (this._isShowingTooltip()) {
            const elemPosition = this.elementRef.nativeElement.getBoundingClientRect();

            if (elemPosition) {
                let elemHeight = this.elementRef.nativeElement.offsetHeight;
                let elemWidth = this.elementRef.nativeElement.offsetWidth;

                if (this.placement == 'top') {
                    this._tooltipElement.style.top = elemPosition.top - (this._tooltipHeight + this.tooltipOffset) + 'px';
                }

                if (this.placement == 'bottom') {
                    this._tooltipElement.style.top = elemPosition.top + elemHeight + this.tooltipOffset + 'px';
                }

                if (this.placement == 'top' || this.placement == 'bottom') {
                    this._tooltipElement.style.left = (elemPosition.left + elemWidth / 2) - this._tooltipWidth / 2 + 'px';
                }

                if (this.placement == 'left') {
                    this._tooltipElement.style.left = elemPosition.left - this._tooltipWidth - this.tooltipOffset + 'px';
                }

                if (this.placement == 'right') {
                    this._tooltipElement.style.left = elemPosition.left + elemWidth + this.tooltipOffset + 'px';
                }

                if (this.placement == 'left' || this.placement == 'right') {
                    this._tooltipElement.style.top = elemPosition.top + elemHeight / 2 - this._tooltipElement.clientHeight / 2 + 'px';
                }
            }
        }else
		{
			this._updateTooltipElement();
		}
    }

    ngOnDestroy() {
        this._removeTooltipElement();
    }
}
