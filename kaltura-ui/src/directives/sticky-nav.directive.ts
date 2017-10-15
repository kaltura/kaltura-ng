import { Directive, Input, Renderer, ElementRef, AfterContentInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';

@Directive({
    selector: '[sticky]'
})

export class StickyNavDirective implements AfterContentInit {
    private offsetTop: number;
    private lastScroll: number = 0;
    private isSticky: boolean = false;
    private originalPosition: string = "static";
    private originalTop: number = 0;
    private originalMarginTop: string = "0px";
    private originalLeft: number = 0;
    @Input('stickyClass') stickyClass: string;
    @Input('stickyTop') stickyTop: number = 0;
    @Input('stickyOffsetTop') stickyOffsetTop: number = 0;
    @Input('container') container: any;

    @HostListener('window:scroll')
    private onScroll() {
        this.manageScrollEvent();
    }

    constructor(private elementRef: ElementRef, private renderer: Renderer) {

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
            this.originalPosition = this.elementRef.nativeElement.style.position;
            this.setStyle('position', 'fixed');
            this.originalTop = this.elementRef.nativeElement.clientTop;
            this.originalMarginTop = this.elementRef.nativeElement.style.marginTop;
            this.setStyle('top', this.stickyTop + 'px');
            if (this.container) {
                this.originalLeft = this.elementRef.nativeElement.clientLeft;
                this.setStyle('left', this.container.getBoundingClientRect()['left'] + 'px');
            }
            this.setClass(true);
        }
    }

    private unsetSticky(): void {
        if (this.isSticky) {
            this.isSticky = false;
            this.setStyle('position', this.originalPosition);
            this.setStyle('marginTop', this.originalMarginTop);
            this.setStyle('top', this.originalTop + 'px');
            if (this.container) {
                this.setStyle('left', this.originalLeft + 'px');
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
