import {
  Component,
  AfterViewInit,
  EventEmitter,
  OnDestroy,
  Input,
  Output,
  ElementRef,
  HostListener,
  TemplateRef,
  ContentChild,
  Renderer2,
  HostBinding
} from "@angular/core";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { PopupWidgetLayout } from './popup-widget-layout';
import 'rxjs/add/observable/fromEvent';
import { cancelOnDestroy } from '@kaltura-ng/kaltura-common';

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
	@Input() fullScreen: boolean = false;
	@Input() closeBtn: boolean = true;
	@Input() closeBtnInside: boolean = false;
	@Input() closeOnClickOutside: boolean = true;
	@Input() closeOnResize: boolean = false;
	@Input() closeOnBrowserNav: boolean = true;
	@Input() targetOffset: any = {'x':0, 'y': 0};
	@Input() childrenPopups: PopupWidgetComponent[] = [];
	@Input() trigger: 'click' | 'hover' = 'click';
	@Input() placement: {x: PopupWidgetXPositions, y: PopupWidgetYPositions} = {x: 'right', y: 'bottom'}
  @Input() closeOnScroll: boolean = false;

  @ContentChild(TemplateRef, { static: false }) public _template: TemplateRef<any>;
  @HostBinding('class.opened') opened = false;
  @HostBinding('class.closed') closed = false;


	private readonly _toggleFunc = this.toggle.bind(this);
	private readonly _openFunc = this.open.bind(this);
	private readonly _closeFunc = this.close.bind(this);

    private _viewInitialize = false;

	@Input() set targetRef(targetRef: any) {
		if (this.trigger === 'click') {
			if (this._targetRef) {
				this._targetRef.removeEventListener('click', this._toggleFunc);
			}
			this._targetRef = targetRef;
			if (this._targetRef) {
				this._targetRef.addEventListener('click', this._toggleFunc);
			}
		}
		else if (this.trigger === 'hover') {
			if (this._targetRef) {
				this._targetRef.removeEventListener('mouseover', this._openFunc);
				this._targetRef.removeEventListener('mouseout', this._closeFunc);
			}
			this._targetRef = targetRef;
			if (this._targetRef) {
				this._targetRef.addEventListener('mouseover', this._openFunc);
				this._targetRef.addEventListener('mouseout', this._closeFunc);
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
    private _saveScrollPosition: number;
	public _popupWidgetHeight: string;
    private _modalOverlay: any;
	private _parentPopup: PopupWidgetComponent;
	private _stateChangeSubscription: ISubscription = null;
	private _statechange: BehaviorSubject<popupStatus> = new BehaviorSubject<popupStatus>({state: ''});

	public state$: Observable<popupStatus> = this._statechange.asObservable();

    constructor(public popup: ElementRef, private renderer: Renderer2) {
	    this._statechange.next({state: PopupWidgetStates.Close});
      this.state$
        .pipe(cancelOnDestroy(this))
        .subscribe(({ state }) => {
          this.closed = state === PopupWidgetStates.Close;
          this.opened = state === PopupWidgetStates.Open;
        });
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
			this._saveScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            // set location according to targetRef
	        const parentLeft = this.appendTo && !this.modal ? this.appendTo.getBoundingClientRect().left : 0;
	        const parentTop = this.appendTo && !this.modal ? this.appendTo.getBoundingClientRect().top : 0;
	        // center on screen if no targetRef was defined
	        if (!this._targetRef){
	        	if (this.fullScreen){
	        		this.modal = false;
	        		this.preventPageScroll = true;
			        this.renderer.addClass(this.popup.nativeElement, 'fullScreen');
		        }else {
			        this.popup.nativeElement.style.marginLeft = window.innerWidth / 2 - this.popupWidth / 2 + 'px';
			        if (this.slider) {
				        window.scrollTo(0, 0);
				        this.popup.nativeElement.style.top = "auto";
				        this.closeBtn = false;
				        this.preventPageScroll = true;
				        this.popup.nativeElement.style.bottom = this.popupHeight !== 'auto' ? this.popupHeight * -1 + "px" : "-1000px";
				        setTimeout(() => {
					        this.popup.nativeElement.style.bottom = 0 + "px"; // use timeout to invoke animation
				        }, 0);
			        } else {
                const marginTop = (window.innerHeight / 2 - 100 / 2);
				        this.popup.nativeElement.style.marginTop = marginTop + 'px';
				        this.popup.nativeElement.style.position = "fixed";
			        }
		        }
	        }else{
		        this.popup.nativeElement.style.marginLeft = this._targetRef.getBoundingClientRect().left - parentLeft + this.targetOffset['x'] + 'px';
		        this.popup.nativeElement.style.marginTop = this._targetRef.getBoundingClientRect().top - parentTop + this.targetOffset['y'] + 'px';
		        this.popup.nativeElement.style.position = "absolute";
	        }
            this.popup.nativeElement.style.zIndex = PopupWidgetLayout.getPopupZindex(this.fullScreen);

            // handle modal
	        if (!this._modalOverlay) {
                if (this.trigger !== 'hover') {this._modalOverlay = document.createElement('div');
                if (this.modal || this.slider) {
	                this._modalOverlay.className = "kPopupWidgetModalOverlay";
                }else{
	                this._modalOverlay.className = "kPopupWidgetModalOverlay kTransparent";
                }
                this._modalOverlay.style.zIndex = this.popup.nativeElement.style.zIndex - 1;
                if (!this.slider && this.closeOnClickOutside) {
	                this._modalOverlay.addEventListener("mousedown", (event: any) => {
		                event.stopPropagation();
		                this.close();
	                });
                }
        if (this.appendTo){
			        this.appendChild(this._modalOverlay, this.appendTo);
		        }else {        document.body.appendChild(this._modalOverlay);}
                if (this.modal || this.slider) {
	                PopupWidgetLayout.increaseModalCount();
	                }
                }
            }

            // prevent page scroll
	        if (this.preventPageScroll){
	        	document.body.style.overflowY = 'hidden';
	        	document.body.style.position = 'fixed';
	        }

            setTimeout(()=>{
	            this.addClickOutsideSupport();
            },0);

            this.onOpen.emit(); // dispatch onOpen event (API)
            this._statechange.next({state: PopupWidgetStates.Open});

            if (this.closeOnScroll && this.isShow) {
              window.addEventListener('scroll', this._closeFunc);
            }

		}
	    if (!this.slider && !this.fullScreen && this.popup.nativeElement) {
		    this.popup.nativeElement.style.opacity = 0;
	    }
	    // auto positioning need first the dom to render
		setTimeout(() => {
			this.setPosition();
		}, 0);
    }

    close(context: any = null, reason: string = null){
        if (this.isEnabled && this.isShow) {
          window.removeEventListener('scroll', this._closeFunc);
	        if (this.fullScreen){
		        this.renderer.removeClass(this.popup.nativeElement, 'fullScreen');
	        }
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
		        this.removeClickOutsideSupport();
		        this.restorePageScroll(true);
		        this.onClose.emit(); // dispatch onClose event (API)
		        let timeout = 0;
		        if (this.slider){
			        this.popup.nativeElement.style.bottom = this.popupHeight!== 'auto' ?  this.popupHeight * -1 +"px" :  "-1000px";
			        timeout = 300;
		        }
		        if (this.modal && !this.slider) {
			        PopupWidgetLayout.decreaseModalCount();
		        }
		        setTimeout(()=>{
			        // remove modal
			        if (this._modalOverlay) {
				        if (this.appendTo){
					        this.removeChild(this._modalOverlay, this.appendTo);
				        }else {
					        document.body.removeChild(this._modalOverlay);
				        }
				        this._modalOverlay = null;
			        }
			        if (this.slider) {
				        PopupWidgetLayout.decreaseModalCount();
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
		}else{
			this.setPosition();
		}
	}

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.closeOnBrowserNav) {
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
	        if (this.fullScreen){
		        this.popup.nativeElement.style.width = '0px';
		        this.popup.nativeElement.style.height = '0px';
	        }
        }
    }

    ngOnDestroy(){

    	if (this._targetRef)
    	{
		this._targetRef.removeEventListener('click', this._toggleFunc);
		this._targetRef.removeEventListener('mouseover', this._openFunc);
		this._targetRef.removeEventListener('mouseout', this._closeFunc);
    	}

        if (this._stateChangeSubscription){
            this._stateChangeSubscription.unsubscribe();
        }
	    this._statechange.complete();
        this.removeClickOutsideSupport();
        this.restorePageScroll(false);
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

      window.removeEventListener('scroll', this._closeFunc);
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

    private restorePageScroll(restoreScrollPosition = true):void{
	    if (this.preventPageScroll){
		    document.body.style.overflowY = 'auto';
		    document.body.style.position = '';
		    if (restoreScrollPosition) {
			    window.scrollTo(0, this._saveScrollPosition);
		    }
	    }
    }

    private validate(){
        let valid: boolean = typeof this.popupWidth !== 'undefined' || this.fullScreen;
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
    const popupHeight = this.popup.nativeElement.clientHeight;
		const popupWidth = this.popup.nativeElement.clientWidth;

    if (this.modal || this.slider) {
      this.popup.nativeElement.style.marginLeft = window.innerWidth / 2 - this.popupWidth / 2 + 'px';

      if (this.modal) {
        const modalMarginTop = (
          window.innerHeight / 2 -
          popupHeight / 2
        );
        this.popup.nativeElement.style.marginTop = Math.round(modalMarginTop) + 'px';
        this.popup.nativeElement.style.opacity = 1;
      }
			return;
		}
		if (!this._targetRef) return;

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
			+ this.targetRef.clientWidth
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
			if (popupBox.top + popupHeight > clientHeight - WINDOW_GUTTER && popupBox.top > clientHeight) {
				popupMarginTop = popupTopMargins.top;
			}else {
        popupMarginTop = popupTopMargins.bottom;
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

		if (popupBox.left + popupWidth > clientWidth + WINDOW_GUTTER) {
			popupMarginLeft = popupLeftMargins.left;
		}
		else if (popupBox.left < WINDOW_GUTTER) {
			popupMarginLeft = popupLeftMargins.right;
		}

		this.popup.nativeElement.style.marginTop = Math.round(popupMarginTop) + 'px';
		this.popup.nativeElement.style.marginLeft = Math.round(popupMarginLeft) + 'px';
		this.popup.nativeElement.style.opacity = 1;
	}

}
