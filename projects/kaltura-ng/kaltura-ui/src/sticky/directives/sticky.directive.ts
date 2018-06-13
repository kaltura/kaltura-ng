import { Directive, Input, Renderer, ElementRef, AfterViewInit, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { StickyScrollService } from '../services/sticky-scroll.service';

@Directive({
    selector: '[kSticky]'
})

export class StickyDirective implements OnInit, OnDestroy, AfterViewInit {
    private lastScroll: number = 0;
    public isSticky: boolean = false;
    private originalCss: any;
    private _destroyed = false;

    @Output() onStickyEvent = new EventEmitter<any>();
    @Output() onUnStickyEvent = new EventEmitter<any>();

    @Input() stickyClass: string;
    @Input() scrollOffset: number = 0;
    @Input() appendTo: any;
    @Input() stickyId: string = "";
    @Input() sticksTo: string = "";
    @Input() elementSelector: string = "";

    private _parentTop: number = null;
    private _parentOffset: number = null;
    private _stickyTop: number = null;
    private _stickyOffset: number = null;

    protected _stickyElement: any;

    constructor(private elementRef: ElementRef, private renderer: Renderer, private _stickyScrollService: StickyScrollService) {

    }

    protected _getStickyElement(elementRef: ElementRef) :any{
        return elementRef.nativeElement;
    }

    ngAfterViewInit(): void {
        // console.log(`[${this.stickyId}] - ngAfterViewInit`);
        this._stickyElement = this._getStickyElement(this.elementRef);
        this.update();
    }

    ngOnInit(){
        // console.log(`[${this.stickyId}] - attached`);
        if (this.stickyId) {
            this._stickyScrollService.attach(this.stickyId);
        }

        this._stickyScrollService.scrollStatus$.cancelOnDestroy(this).subscribe(
            event => {
                // console.log(`[${this.stickyId}] - handle scroll`);
                this._render();
            }
        );

        this._stickyScrollService.resizeStatus$.cancelOnDestroy(this).subscribe(
                event => {
                    this.onResize();
                }
            );

        this._stickyScrollService.layoutSubject$.cancelOnDestroy(this).subscribe(
            elements =>{
                const data = this.sticksTo ? elements[this.sticksTo] : {height: 0, offset: 0};
                if (data && (
                        this._parentTop !== data.height ||
                        this._parentOffset !== data.offset
                    )
                ){
                    this._parentTop = data.height;
                    this._parentOffset = data.offset;
                    this.update();
                }
            }
        );
    }

    ngOnDestroy(){
        // console.log(`[${this.stickyId}] - destroyed`);
        this._destroyed = true;
        this._stickyScrollService.detach(this.stickyId);
    }

    public update() : void{
        if (this._parentTop !== null
            && this._parentOffset != null)
        {
            // console.log(`[${this.stickyId}] - handle layout update`);
            const stickyOffset = this._parentOffset + this.scrollOffset;
            if (this._stickyTop !== this._parentTop ||
                this._stickyOffset !== stickyOffset)
            {
                // console.log(`[${this.stickyId}] - update cached values`);
                this._stickyTop = this._parentTop;
                this._stickyOffset = stickyOffset;
                this._render();
            }

            if (this.stickyId && this._stickyElement) {
                // console.log(`[${this.stickyId}] - update service`);
                const elementHeight = this._stickyElement.getBoundingClientRect()['height'];
                this._stickyScrollService.update(this.stickyId, elementHeight + this._stickyTop, this._stickyOffset);
            }
        }
    }

    private _render() : void
    {
        if (!this._destroyed && this._stickyElement) {
            // console.log(`[${this.stickyId}] - _render`);

            if (this._stickyTop !== null
                && this._stickyOffset != null) {
                const scroll = window.pageYOffset;
                if (scroll > this.lastScroll && !this.isSticky && this._stickyElement.getBoundingClientRect()['top'] <= this._stickyTop) {
                    // console.log(`[${this.stickyId}] - _render (set sticky mode)`);
                    this.setSticky();
                } else if (scroll < this.lastScroll && this.isSticky && scroll <= this._stickyOffset) {
                    // console.log(`[${this.stickyId}] - _render (unset sticky mode)`);
                    this.unsetSticky();
                }else
                {
                    if (this.isSticky && scroll === this.lastScroll) {
                        this.setStyle('top', this._stickyTop + 'px');
                        // console.log(`[${this.stickyId}] - _render (update sitcky values) - TODO!!!!!!`);
                    }
                }
                this.lastScroll = scroll;
            }
        }
    }


    private setSticky(): void {
        if (!this.isSticky) {
            this.isSticky = true;
            // console.log(`[${this.stickyId}] - top = ${this._stickyElement.clientTop}`);
            this.originalCss = {
                position: this._stickyElement.style.position,
                top: this._stickyElement.clientTop,
                marginTop: this._stickyElement.style.marginTop,
                left: this._stickyElement.clientLeft
            };
            this.setStyle('position', 'fixed');
            this.setStyle('top', this._stickyTop + 'px');
            if (this.appendTo) {
                this.setStyle('left', this.appendTo.getBoundingClientRect()['left'] + 'px');
            }
            this.setClass(true);
            this.onStickyEvent.emit();
            this._onSticky();
        }
    }

    protected _onSticky():void{
        setTimeout(()=> {this.update()},0);
    }

    private unsetSticky(): void {
        if (this.isSticky) {
            this.isSticky = false;
            this.setStyle('position', this.originalCss.position);
            this.setStyle('marginTop', this.originalCss.marginTop);
            this.setStyle('top', this.originalCss.top + 'px');
            if (this.appendTo) {
                this.setStyle('left', this.originalCss.left + 'px');
            }
            this.setClass(false);
            this.onUnStickyEvent.emit();
            this._onUnsetSticky();
        }
    }

    protected _onUnsetSticky():void{
        setTimeout(()=> {this.update()},0);
    }

    protected onResize():void{}; // used by primeng directive to update table layout

    private setStyle(key: string, value: string): void {
        this.renderer.setElementStyle(this._stickyElement, key, value);
    }

    private setClass(add: boolean): void {
        this.renderer.setElementClass(this._stickyElement, this.stickyClass, add);
    }

}
