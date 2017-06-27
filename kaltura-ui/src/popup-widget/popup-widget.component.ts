import { Component, AfterViewInit, EventEmitter, OnDestroy, Input, Output, ElementRef, HostListener, OnInit, TemplateRef, ContentChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";
import { PopupWidgetLayout } from './popup-widget-layout';

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
@Component({
    selector: 'kPopupWidget',
    templateUrl: './popup-widget.component.html',
    styleUrls: ['./popup-widget.component.scss']
})
export class PopupWidgetComponent implements AfterViewInit, OnDestroy, OnInit{

	@Input() appendTo: any;
	@Input() popupWidth: number;
    @Input() popupHeight: number | 'auto' = 'auto';
	@Input() showTooltip: boolean = false;
	@Input() modal: boolean = false;
	@Input() closeBtn: boolean = true;
	@Input() closeOnClickOutside: boolean = true;
	@Input() targetOffset: any = {'x':0, 'y': 0};
	@Input() childrenPopups: PopupWidgetComponent[] = [];
	@ContentChild(TemplateRef) public _template: TemplateRef<any>;

	@Input() set targetRef(targetRef: any) {
		if (this._targetRef) {
			this._targetRef.removeEventListener('click', this.toggle.bind(this));
		}
		this._targetRef = targetRef;
		if (this._targetRef) {
			this._targetRef.addEventListener('click', this.toggle.bind(this));
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

    @HostListener('document:mousedown')
    private onMousedown() {
    	if (this.closeOnClickOutside && !this.modal) {
		    this.close();
	    }
    }

	private _targetRef: any;
	public _popupWidgetHeight: string;
    private _modalOverlay: any;
	private _parentPopup: PopupWidgetComponent;
	private _stateChangeSubscription: Subscription = null;
	private _statechange: BehaviorSubject<popupStatus> = new BehaviorSubject<popupStatus>({state: ''});

	public state$: Observable<popupStatus> = this._statechange.asObservable();

    constructor(public popup: ElementRef) {
	    this._statechange.next({state: PopupWidgetStates.Close});
    }

    // public API methods
    open(){
        if (this.isEnabled && this.validate()) {
            // set location according to targetRef
	        const parentLeft = this.appendTo && !this.modal ? this.appendTo.getBoundingClientRect().left : 0;
	        const parentTop = this.appendTo && !this.modal ? this.appendTo.getBoundingClientRect().top : 0;
	        // center on screen if no targetRef was defined
	        if (!this._targetRef){
		        this.popup.nativeElement.style.marginLeft = window.innerWidth/2 - this.popupWidth/2 + 'px';
		        const marginTop = this.popupHeight !== 'auto' ? (window.innerHeight/2 - this.popupHeight/2) : 100;
		        this.popup.nativeElement.style.marginTop = marginTop + 'px';
	        }else{
		        this.popup.nativeElement.style.marginLeft = this._targetRef.getBoundingClientRect().left - parentLeft + this.targetOffset['x'] + 'px';
		        this.popup.nativeElement.style.marginTop = this._targetRef.getBoundingClientRect().top - parentTop + this.targetOffset['y'] + 'px';
	        }
            this.popup.nativeElement.style.zIndex = PopupWidgetLayout.getPopupZindex();

	        // verify the widget is not cut off by the browser window right hand side
	        const viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	        const diff = viewPortWidth - this.popup.nativeElement.getBoundingClientRect().left - this.popupWidth;
	        if (diff < 0){
		        this.popup.nativeElement.style.marginLeft = parseInt(this.popup.nativeElement.style.marginLeft) + diff - 2 + "px";
	        }

            // handle modal
	        if (this.modal && !this._modalOverlay) {
                this._modalOverlay = document.createElement('div');
                this._modalOverlay.className = "kPopupWidgetModalOverlay";
                this._modalOverlay.style.zIndex = this.popup.nativeElement.style.zIndex - 1;
		        this._modalOverlay.addEventListener("mousedown", (event : any) => {event.stopPropagation();this.close();});
                document.body.appendChild(this._modalOverlay);
            }
            setTimeout(()=>{
	            this.addClickOutsideSupport();
            },0);

            this.onOpen.emit(); // dispatch onOpen event (API)
            this._statechange.next({state: PopupWidgetStates.Open});
        }
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
		        // remove modal
		        if (this.modal && this._modalOverlay) {
			        document.body.removeChild(this._modalOverlay);
			        this._modalOverlay = null;
		        }
		        this.removeClickOutsideSupport();
		        this.onClose.emit(); // dispatch onClose event (API)
		        this._statechange.next({state: PopupWidgetStates.Close, context: context, reason: reason});
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

    // component lifecycle events
	ngOnInit()
	{
		if (!this.popupHeight  || this.popupHeight === 'auto'){
			this._popupWidgetHeight = 'auto';

		}else
		{
			this._popupWidgetHeight = this.popupHeight + "px";
		}
	}

    ngAfterViewInit() {
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
		    document.body.removeChild(this.popup.nativeElement);
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
}
