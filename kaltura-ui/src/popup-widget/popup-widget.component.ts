import { Component, AfterViewInit, EventEmitter, OnDestroy, Input, Output, ElementRef, HostListener, TemplateRef, ContentChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { PopupWidgetLayout } from './popup-widget-layout';
import 'rxjs/add/observable/fromEvent';

export const PopupWidgetStates = {
    "Open": "open",
	"BeforeClose": "beforeClose",
    "Close": "close",
	"Disabled": "disabled"
}
export type popupStatus = {
	state: string,
	context?: any,
	reason?: string
}

export type PopupWidgetXPositions = 'left' | 'right' | 'center';
export type PopupWidgetYPositions = 'top' | 'bottom' | 'center';
type PopupWidgetXMargins = {left?: number, right?: number, center?: number}
type PopupWidgetYMargins = {top?: number, bottom?: number, center?: number}

const WINDOW_GUTTER = 16;

@Component({
    selector: 'kPopupWidget',
    templateUrl: './popup-widget.component.html',
    styleUrls: ['./popup-widget.component.scss']
})
export class PopupWidgetComponent implements AfterViewInit, OnDestroy{
	@Input() transparent = false;
	@Input() appendTo: any;
	@Input() popupWidth: number;
    @Input() popupHeight: number | 'auto' = 'auto';
	@Input() showTooltip: boolean = false;
	@Input() preventPageScroll: boolean = false;
	@Input() modal: boolean = false;
	@Input() slider: boolean = false;
	@Input() closeBtn: boolean = true;
	@Input() closeBtnInside: boolean = false;
	@Input() closeOnClickOutside: boolean = true;
	@Input() closeOnResize: boolean = false;
	@Input() targetOffset: any = {'x':0, 'y': 0};
	@Input() childrenPopups: PopupWidgetComponent[] = [];
	@Input() closeOnScroll: boolean = false;
	@Input() trigger: 'click' | 'hover' = 'click';
	@Input() placement: {x: PopupWidgetXPositions, y: PopupWidgetYPositions} = {x: 'right', y: 'bottom'}
	
	@ContentChild(TemplateRef) public _template: TemplateRef<any>;

  private _viewInitialize = false;

	@Input() set targetRef(targetRef: any) {
		if (this.trigger === 'click') {
			if (this._targetRef) {
				this._targetRef.removeEventListener('click', this.toggle.bind(this));
			}
			this._targetRef = targetRef;
			if (this._targetRef) {
				this._targetRef.addEventListener('click', this.toggle.bind(this));
			}
		}
		else if (this.trigger === 'hover') {
			if (this._targetRef) {
				this._targetRef.removeEventListener('mouseover', this.open.bind(this));
				this._targetRef.removeEventListener('mouseout', this.close.bind(this));
			}
			this._targetRef = targetRef;
			if (this._targetRef) {
				this._targetRef.addEventListener('mouseover', this.open.bind(this));
				this._targetRef.addEventListener('mouseout', this.close.bind(this));
			}
		}
	}
	get targetRef(): any { return this._targetRef; }

	@Input() set parentPopup(parentPopup: PopupWidgetComponent){
		this._parentPopup = parentPopup;
		if (this._stateChangeSubscription){
			this._stateChangeSubscription.unsubscribe();
			this._stateChangeSubscription = null;
		}
		if (this._parentPopup) {
			this._stateChangeSubscription = this._parentPopup.state$.subscribe(event => {
				if (event.state === PopupWidgetStates.Close) {
					this.close();
				}
			});
		}
	}
	get parentPopup(): PopupWidgetComponent { return this._parentPopup; }

	@Output() onOpen = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();

	private _targetRef: any;
    private _saveOriginalScroll: string = "";
	public _popupWidgetHeight: string;
    private _modalOverlay: any;
	private _parentPopup: PopupWidgetComponent;
	private _stateChangeSubscription: ISubscription = null;
	private _statechange: BehaviorSubject<popupStatus> = new BehaviorSubject<popupStatus>({state: ''});

	public state$: Observable<popupStatus> = this._statechange.asObservable();

    constructor(public popup: ElementRef) {
	    this._statechange.next({state: PopupWidgetStates.Close});
    }

    // public API methods
    open(){
		if (this.isEnabled && this.validate()) {
	        // handle auto height
			if (!this.popupHeight  || this.popupHeight === 'auto'){
				if (this.slider) {
					this._popupWidgetHeight = 'calc(100vh - 80px)';
				}else {
					this._popupWidgetHeight = 'auto';
				}
	        } else
	        {
		        this._popupWidgetHeight = this.popupHeight + "px";
	        }
            // set location according to targetRef
	        const parentLeft = this.appendTo && !this.modal ? this.appendTo.getBoundingClientRect().left : 0;
	        const parentTop = this.appendTo && !this.modal ? this.appendTo.getBoundingClientRect().top : 0;
	        // center on screen if no targetRef was defined
	        if (!this._targetRef){
		        this.popup.nativeElement.style.marginLeft = window.innerWidth/2 - this.popupWidth/2 + 'px';
		        if (this.slider) {
			        window.scrollTo(0,0);
			        this.popup.nativeElement.style.top = "auto";
			        this.closeBtn = false;
			        this.preventPageScroll = true;
			        this.popup.nativeElement.style.bottom = this.popupHeight!== 'auto' ?  this.popupHeight * -1 +"px" :  "-1000px";
			        setTimeout(()=>{
				        this.popup.nativeElement.style.bottom = 0 +"px"; // use timeout to invoke animation
			        },0);
		        }else{
			        const marginTop = this.popupHeight !== 'auto' ? (window.innerHeight / 2 - this.popupHeight / 2) : 100;
			        this.popup.nativeElement.style.marginTop = marginTop + 'px';
			        this.popup.nativeElement.style.position = "fixed";
		        }
	        }else{
		        this.popup.nativeElement.style.marginLeft = this._targetRef.getBoundingClientRect().left - parentLeft + this.targetOffset['x'] + 'px';
		        this.popup.nativeElement.style.marginTop = this._targetRef.getBoundingClientRect().top - parentTop + this.targetOffset['y'] + 'px';
		        this.popup.nativeElement.style.position = "absolute";
	        }
            this.popup.nativeElement.style.zIndex = PopupWidgetLayout.getPopupZindex();

	        // verify the widget is not cut off by the browser window right hand side
	        const viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	        const diff = viewPortWidth - this.popup.nativeElement.getBoundingClientRect().left - this.popupWidth;
	        if (diff < 0){
		        this.popup.nativeElement.style.marginLeft = parseInt(this.popup.nativeElement.style.marginLeft) + diff - 18 + "px"; // 18 pixels due to vertical scroll bar
			}

            // handle modal
	        if (!this._modalOverlay) {
				if (this.trigger !== 'hover') {
					this._modalOverlay = document.createElement('div');
                if (this.modal || this.slider) {
	                this._modalOverlay.className = "kPopupWidgetModalOverlay";
                }else{
	                this._modalOverlay.className = "kPopupWidgetModalOverlay kTransparent";
                }
                this._modalOverlay.style.zIndex = this.popup.nativeElement.style.zIndex - 1;
                if (!this.slider) {
	                this._modalOverlay.addEventListener("mousedown", (event: any) => {
		                event.stopPropagation();
		                this.close();
	                });
                }
                document.body.appendChild(this._modalOverlay);
                if (this.modal || this.slider) {
	                document.body.classList.add("kModal");
                }
				}
            }

            // prevent page scroll
	        if (this.preventPageScroll){
	        	this._saveOriginalScroll = window.getComputedStyle(document.body)["overflow-y"];
	        	document.body.style.overflowY = 'hidden';
	        }

            setTimeout(()=>{
	            this.addClickOutsideSupport();
            },0);

            this.onOpen.emit(); // dispatch onOpen event (API)
            this._statechange.next({state: PopupWidgetStates.Open});
		}
		// auto positioning need first the dom to render
		setTimeout(() => {
			this.setPosition();
		}, 0);
    }

    close(context: any = null, reason: string = null){
        if (this.isEnabled && this.isShow) {
			// allow cancelling the close operation
	        let beforeCloseContext = {"allowClose": true};
	        this._statechange.next({state: PopupWidgetStates.BeforeClose, context: beforeCloseContext});
	        if (beforeCloseContext['allowClose']) {
		        // close children popups if exist
		        if (this.childrenPopups.length) {
			        this.childrenPopups.forEach((popup: PopupWidgetComponent) => {
				        popup.close();
			        });
		        }
		        if (this.preventPageScroll){
			        document.body.style.overflowY = this._saveOriginalScroll;
		        }
		        this.removeClickOutsideSupport();
		        this.onClose.emit(); // dispatch onClose event (API)
		        let timeout = 0;
		        if (this.slider){
			        this.popup.nativeElement.style.bottom = this.popupHeight!== 'auto' ?  this.popupHeight * -1 +"px" :  "-1000px";
			        timeout = 300;
		        }
		        if (this.modal && !this.slider) {
			        document.body.classList.remove("kModal");
		        }
		        setTimeout(()=>{
			        // remove modal
			        if (this._modalOverlay) {
				        document.body.removeChild(this._modalOverlay);
				        this._modalOverlay = null;
			        }
			        if (this.slider) {
				        document.body.classList.remove("kModal");
			        }
			        this._statechange.next({state: PopupWidgetStates.Close, context: context, reason: reason}); // use timeout to prevent valueChangeAfterChecked error
		        },timeout);
	        }
        }

    }

    toggle(){
        if (this.isEnabled) {
            this.isShow ? this.close() : this.open();
        }
    }

    get isShow(): boolean {
    	return this._statechange.getValue().state !== PopupWidgetStates.Close;
    }

    get isEnabled(): boolean {
    	return this._statechange.getValue().state !== PopupWidgetStates.Disabled;
    }


	@HostListener("window:resize", [])
	onWindowResize() {
		if (this.closeOnResize) {
			this.close();
		}
	}

	@HostListener("window:scroll", [])
	onWindowScroll() {
		if (this.closeOnScroll && this.isShow) {
			this.close();
		}
	}

    // component lifecycle events
    ngAfterViewInit() {
      	this._viewInitialize = true;

        if (this.validate()) {
	        if (this.appendTo && !this.modal){
				this.appendChild(this.popup.nativeElement, this.appendTo);
	        }else {
		        document.body.appendChild(this.popup.nativeElement);
		        if (this.appendTo){
		        	console.warn("[kaltura] -> Ignoring append to " + this.appendTo + " since popup is set to modal=true."); // keep warning
		        }
			}
        }
    }

    ngOnDestroy(){
    	if (this._targetRef) {
		    this._targetRef.removeEventListener('click', (e: any) => this.toggle());
	    }
        if (this._stateChangeSubscription){
            this._stateChangeSubscription.unsubscribe();
        }
	    this._statechange.complete();
        this.removeClickOutsideSupport();
	    if (this.modal && this._modalOverlay) {
		    document.body.removeChild(this._modalOverlay);
		    this._modalOverlay = null;
	    }
	    if (this.appendTo && !this.modal){
		    this.removeChild(this.popup.nativeElement, this.appendTo);
	    }else {
	    	if (this._viewInitialize) {
          document.body.removeChild(this.popup.nativeElement);
				}
	    }
    }

    // private methods

    private addClickOutsideSupport(){
        if (this.closeOnClickOutside){
            this.popup.nativeElement.addEventListener('mousedown', this.blockMouseDownHandler);
	        if (this.targetRef) {
		        this.targetRef.addEventListener('mousedown', this.blockMouseDownHandler);
	        }
        }
    }

    private blockMouseDownHandler(event: any){
	    event.stopPropagation();
    }

    private removeClickOutsideSupport(){
        if (this.closeOnClickOutside){
            this.popup.nativeElement.removeEventListener('mousedown', this.blockMouseDownHandler);
	        if (this.targetRef) {
		        this.targetRef.removeEventListener('mousedown', this.blockMouseDownHandler);
	        }
        }
    }

    private validate(){
        let valid: boolean = typeof this.popupWidth !== 'undefined';
        if (!valid){
	        this._statechange.next({state: PopupWidgetStates.Disabled});
	        throw "Popup widget error: missing required parameters. Verify popupWidth is defined.";
        }
        return valid;
    }

	private appendChild(element: any, target: any) {
		if (this.isElement(target)) {
			target.appendChild(element);
		}else {
			throw 'Cannot append ' + target + ' to ' + element;
		}
	}

	private removeChild(element: any, target: any) {
		if (this.isElement(target)) {
			target.removeChild(element);
		}else {
			throw 'Cannot remove ' + target + ' from ' + element;
		}
	}

	private isElement(obj: any) {
		return (typeof HTMLElement === "object" ? obj instanceof HTMLElement :
			obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string"
		);
	}

	private setPosition() {
		// placement and repositioning is not relevent to modals.
		if (this.modal) return;
		
		const popupHeight = this.popup.nativeElement.clientHeight;
		const popupWidth = this.popup.nativeElement.clientWidth;
		const popupBox = this.popup.nativeElement.getBoundingClientRect();
		const targetRefBox = this._targetRef.getBoundingClientRect();
		const parentTop = this.appendTo && !this.modal ? this.appendTo.getBoundingClientRect().top : 0;
		const parentLeft = this.appendTo && !this.modal ? this.appendTo.getBoundingClientRect().left : 0;

		let popupMarginTop: number;
		let popupMarginLeft: number;

		let popupLeftMargins: PopupWidgetXMargins = {}
		let popupTopMargins: PopupWidgetYMargins = {}

		popupTopMargins.top = (
			targetRefBox.top 
			- parentTop 
			- popupHeight
			+ this.targetRef.offsetHeight
			- this.targetOffset['y']
		);

		popupTopMargins.bottom = (
			targetRefBox.top 
			- parentTop 
			+ this.targetOffset['y']
		);

		popupTopMargins.center = (
			targetRefBox.top 
			- parentTop 
			- popupHeight / 2
			+ this.targetRef.offsetHeight / 2
			+ this.targetOffset['y']
		);

		popupLeftMargins.left = (
			targetRefBox.left 
			- parentLeft 
			- popupWidth
			- this.targetOffset['x']
		);

		popupLeftMargins.right = (
			targetRefBox.left 
			- parentLeft 
			+ this.targetOffset['x']
		);

		popupLeftMargins.center = (
			targetRefBox.left 
			- parentLeft 
			- popupWidth / 2
			+ this.targetOffset['x']
		);

		popupMarginTop = this.placement.y ? popupTopMargins[this.placement.y] : popupTopMargins.bottom;
		popupMarginLeft = this.placement.x ? popupLeftMargins[this.placement.y] : popupLeftMargins.right;

		this.popup.nativeElement.style.opacity = 0;
		this.popup.nativeElement.style.marginTop = Math.round(popupMarginTop) + 'px';
		this.popup.nativeElement.style.marginLeft = Math.round(popupMarginLeft) + 'px';
		
		this.validatePosition(popupLeftMargins, popupTopMargins);
	}

	// validate popup widget is not outside of the viewport (+ gutter) and if it is, reposition it
	private validatePosition(popupLeftMargins: PopupWidgetXMargins, popupTopMargins: PopupWidgetYMargins) {

		const popupHeight = this.popup.nativeElement.clientHeight;
		const popupWidth = this.popup.nativeElement.clientWidth;
		const popupBox = this.popup.nativeElement.getBoundingClientRect();
		const clientHeight = window.innerHeight;
		const clientWidth = window.innerWidth;

		let popupMarginTop: number;
		let popupMarginLeft: number;
		
		if (this.placement.y === 'top') {
			if (popupBox.top < WINDOW_GUTTER) {
				popupMarginTop = popupTopMargins.bottom;
			}
		}
		else if (this.placement.y === 'bottom') {
			if (popupBox.top + popupHeight > clientHeight - WINDOW_GUTTER) {
				popupMarginTop = popupTopMargins.top;
			}
		}
		else if (this.placement.y === 'center') {
			if (popupBox.top < WINDOW_GUTTER) {
				popupMarginTop = popupTopMargins.bottom;
			}
			else if (popupBox.top + popupHeight > clientHeight - WINDOW_GUTTER) {
				popupMarginTop = popupTopMargins.top;
			}
		}

		if (this.placement.x === 'left') {
			if (popupBox.left < WINDOW_GUTTER) {
				popupMarginLeft = popupLeftMargins.right;
			}
		}
		else if (this.placement.x === 'right') {
			if (popupBox.left + popupWidth > clientWidth + WINDOW_GUTTER) {
				popupMarginLeft = popupLeftMargins.left;
			}
		}
		else if (this.placement.x === 'center') {
			if (popupBox.left < WINDOW_GUTTER) {
				popupMarginLeft = popupLeftMargins.right;
			} 
			else if (popupBox.left + popupWidth > clientWidth + WINDOW_GUTTER) {
				popupMarginLeft = popupLeftMargins.left;
			}
		}

		this.popup.nativeElement.style.marginTop = Math.round(popupMarginTop) + 'px';
		this.popup.nativeElement.style.marginLeft = Math.round(popupMarginLeft) + 'px';
		this.popup.nativeElement.style.opacity = 1;
	}
}
