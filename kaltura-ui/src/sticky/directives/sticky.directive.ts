import { Directive, Input, Renderer, ElementRef, AfterContentInit, OnInit, OnDestroy } from '@angular/core';
import { StickyScrollService } from '../services/sticky-scroll.service';

@Directive({
    selector: '[sticky]'
})

export class StickyDirective implements OnInit, OnDestroy {
    private lastScroll: number = 0;
    private isSticky: boolean = false;
    private originalCss: any;
    private _destroyed = false;



    @Input() stickyClass: string;
@Input() stickyTop: number; //TODO  remove

    @Input() scrollOffset: number = 0;
    @Input() container: any;
    @Input() stickyId: string = "";
    @Input() sticksTo: string = "";

    private _parentTop: number = null;
    private _parentOffset: number = null;
    private _stickyTop: number = null;
    private _stickyOffset: number = null;

    constructor(private elementRef: ElementRef, private renderer: Renderer, private _stickyScrollService: StickyScrollService) {

    }

    ngOnChanges()
    {
        // TODO
    }

    ngOnInit(){
        console.log(`[${this.stickyId}] - attached`);
        this._stickyScrollService.attach(this.stickyId);

        this._stickyScrollService.scrollStatus$.cancelOnDestroy(this).subscribe(
            event => {
                console.log(`[${this.stickyId}] - handle scroll`);
                this._render();
            }
        );

        this._stickyScrollService.layoutSubject$.cancelOnDestroy(this).subscribe(
            elements =>{
                console.log(`[${this.stickyId}] - handle layout update`);
                if (this.sticksTo){
                    const data = elements[this.sticksTo];
                    if (typeof data  !== "undefined" && data !== null){
                        this._parentTop = data.height;
                        this._parentOffset = data.offset;
                        this.update();
                    }
                }else{
                    this._parentTop = 0;
                    this._parentOffset = 0;
                    this.update();
                }
            }
        );
    }

    ngOnDestroy(){
        console.log(`[${this.stickyId}] - destroyed`);
        this._destroyed = true;
        this._stickyScrollService.detach(this.stickyId);
    }

    public update() : void{
        if (this._parentTop !== null
            && this._parentOffset != null)
        {
            const stickyOffset = this._parentOffset + this.scrollOffset;
            if (this._stickyTop !== this._parentTop ||
                this._stickyOffset !== stickyOffset)
            {
                console.log(`[${this.stickyId}] - update cached values`);
                this._stickyTop = this._parentTop;
                this._stickyOffset = stickyOffset;
                this._render();
            }

            if (this.stickyId) {
                console.log(`[${this.stickyId}] - update service`);
                const elementHeight = this.elementRef.nativeElement.getBoundingClientRect()['height'];
                this._stickyScrollService.update(this.stickyId, elementHeight + this._stickyTop, this._stickyOffset);
            }
        }
    }

    private _render() : void
    {
        if (!this._destroyed) {
            console.log(`[${this.stickyId}] - _render`);

            if (this._stickyTop !== null
                && this._stickyOffset != null) {
                const scroll = window.pageYOffset;
                if (scroll > this.lastScroll && !this.isSticky && this.elementRef.nativeElement.getBoundingClientRect()['top'] <= this._stickyTop) {
                    this.setSticky();
                } else if (scroll < this.lastScroll && this.isSticky && scroll <= this._stickyOffset) {
                    this.unsetSticky();
                }
                this.lastScroll = scroll;
            }
        }
    }


    private setSticky(): void {
        if (!this.isSticky) {
            this.isSticky = true;
            this.originalCss = {
                position: this.elementRef.nativeElement.style.position,
                top: this.elementRef.nativeElement.clientTop,
                marginTop: this.elementRef.nativeElement.style.marginTop,
                left: this.elementRef.nativeElement.clientLeft
            };
            this.setStyle('position', 'fixed');
            this.setStyle('top', this._stickyTop + 'px');
            if (this.container) {
                this.setStyle('left', this.container.getBoundingClientRect()['left'] + 'px');
            }
            this.setClass(true);
        }
    }

    private unsetSticky(): void {
        if (this.isSticky) {
            this.isSticky = false;
            this.setStyle('position', this.originalCss.position);
            this.setStyle('marginTop', this.originalCss.marginTop);
            this.setStyle('top', this.originalCss.top + 'px');
            if (this.container) {
                this.setStyle('left', this.originalCss.left + 'px');
            }
            this.setClass(false);
        }
    }

    private setStyle(key: string, value: string): void {
        this.renderer.setElementStyle(this.elementRef.nativeElement, key, value);
    }

    private setClass(add: boolean): void {
        this.renderer.setElementClass(this.elementRef.nativeElement, this.stickyClass, add);
    }

}
