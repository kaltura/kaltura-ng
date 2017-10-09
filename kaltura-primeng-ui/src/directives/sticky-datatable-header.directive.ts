import { Directive, Input, Renderer, ElementRef, AfterContentInit, OnDestroy, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';

@Directive({
    selector: '[stickyHeader]'
})

export class StickyDatatableHeaderDirective implements AfterContentInit, OnDestroy, OnChanges {
    private windowScrollSubscription: ISubscription = null;
    private windowResizeSubscription: ISubscription = null;
    private header: any = null;
    private body: any = null;
    private offsetTop: number;
    private lastScroll: number = 0;
    private isSticky: boolean = false;
    private hasHeader: boolean = false;
    private headerTop = 0;
    @Input('stickyClass') stickyClass: string = "";
    @Input('stickyTop') stickyTop: number = 0;
    @Input('stickyOffsetTop') stickyOffsetTop: number = 0;

    constructor(private elementRef: ElementRef, private renderer: Renderer) {

    }

    ngAfterContentInit(): void {
        setTimeout(()=>{
            this.windowScrollSubscription = Observable.fromEvent(window, 'scroll').subscribe(() => this.manageScrollEvent());
            this.windowResizeSubscription = Observable.fromEvent(window, 'resize').subscribe(() => this.updateHeaderSize());
            const headers = this.elementRef.nativeElement.getElementsByClassName('ui-datatable-scrollable-header');
            this.hasHeader = headers.length > 0;
            if (this.hasHeader) {
                this.header = headers[0];
                this.headerTop = this.header.getBoundingClientRect()['top'];
                this._calcPosition();
            }
            const tableBody = this.elementRef.nativeElement.getElementsByClassName('ui-datatable-scrollable-body');
            if (tableBody.length){
                this.body = tableBody[0];
            }
        }, 0);
    }

    ngOnDestroy(): void {
        if (this.windowScrollSubscription){
            this.windowScrollSubscription.unsubscribe();
            this.windowScrollSubscription = null;
        }
        if (this.windowResizeSubscription){
            this.windowResizeSubscription.unsubscribe();
            this.windowResizeSubscription = null;
        }
    }

    ngOnChanges(changes)
    {
        if (changes.stickyTop || changes.stickyOffsetTop) {
            this._calcPosition();
        }
    }

    private _calcPosition(){
        if (this.hasHeader) {
            this.offsetTop = this.headerTop - this.stickyOffsetTop;
            const scroll = window.pageYOffset;
            if (this.isSticky && scroll >= this.offsetTop) {
                this.header.style.top =  this.stickyTop + 'px';
            }
        }
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
        this.isSticky = true;
        this.header.style.position = 'fixed';
        this.header.style.top =  this.stickyTop + 'px';
        this.body.style.marginTop =  (this.stickyTop - 12) + 'px';
        this.updateHeaderSize();
        this.setClass(true);
    }

    private updateHeaderSize(){
        if (this.isSticky) {
            const tableWidth = this.elementRef.nativeElement.getBoundingClientRect()['right'] - this.elementRef.nativeElement.getBoundingClientRect()['left'];
            this.header.style.width = tableWidth + 'px';
        }
    }

    private unsetSticky(): void {
        this.isSticky = false;
        this.header.style.position = 'static';
        this.header.style.width = 'auto';
        this.body.style.marginTop =  0 + 'px';
        this.setClass(false);
    }

    private setStyle(key: string, value: string): void {
        this.renderer.setElementStyle(this.header, key, value);
    }

    private setClass(add: boolean): void {
        this.renderer.setElementClass(this.header, this.stickyClass, add);
    }

}
