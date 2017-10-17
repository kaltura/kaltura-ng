import { Directive, Input, Renderer, ElementRef, AfterContentInit, OnInit, OnDestroy } from '@angular/core';
import { StickyScrollService } from '../services/sticky-scroll.service';

@Directive({
    selector: '[sticky]'
})

export class StickyDirective implements OnInit, OnDestroy, AfterContentInit {
    private offsetTop: number;
    private lastScroll: number = 0;
    private isSticky: boolean = false;
    private originalCss: any;

    @Input('stickyClass') stickyClass: string;
    @Input('stickyTop') stickyTop: number = 0;
    @Input('stickyOffsetTop') stickyOffsetTop: number = 0;
    @Input('container') container: any;

    constructor(private elementRef: ElementRef, private renderer: Renderer, private _stickyScrollService: StickyScrollService) {

    }

    ngOnInit(){
        this._stickyScrollService.scrollStatus$.cancelOnDestroy(this).subscribe(
            event => {
                this.manageScrollEvent();
            }
        );
    }

    ngOnDestroy(){

    }

    ngAfterContentInit(): void {
        setTimeout(()=>{
            this.offsetTop = this.elementRef.nativeElement.getBoundingClientRect()['top'] - this.stickyOffsetTop;
        },0);
    }

    private manageScrollEvent(): void {
        const scroll = window.pageYOffset;

        if (scroll > this.lastScroll && !this.isSticky && scroll >= this.offsetTop) {
            this.setSticky();
        } else if (scroll < this.lastScroll && this.isSticky && scroll <= this.offsetTop) {
            this.unsetSticky();
        }
        this.lastScroll = scroll;
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
            this.setStyle('top', this.stickyTop + 'px');
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
