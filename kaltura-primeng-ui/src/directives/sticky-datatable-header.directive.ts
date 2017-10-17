import { Directive, Input, Renderer, ElementRef, OnInit, AfterContentInit, OnDestroy, OnChanges, HostListener } from '@angular/core';
import { StickyScrollService } from '@kaltura-ng/kaltura-ui/sticky';
import { Observable } from 'rxjs';

@Directive({
    selector: '[stickyHeader]'
})

export class StickyDatatableHeaderDirective implements OnInit, AfterContentInit, OnChanges, OnDestroy {
    private header: any = null;
    private offsetTop: number;
    private lastScroll: number = 0;
    private isSticky: boolean = false;
    private hasHeader: boolean = false;
    private headerTop = 0;


    @Input('stickyClass') stickyClass: string = "";
    @Input('stickyTop') stickyTop: number = 0;
    @Input('stickyOffsetTop') stickyOffsetTop: number = 0;

    constructor(private elementRef: ElementRef, private renderer: Renderer, private _stickyScrollService: StickyScrollService) {

    }

    ngOnInit(){
        this._stickyScrollService.scrollStatus$.cancelOnDestroy(this).subscribe(
            event => {
                this.manageScrollEvent();
            }
        );
        this._stickyScrollService.resizeStatus$.cancelOnDestroy(this).subscribe(
            event => {
                this.updateHeaderSize();
            }
        );
    }

    ngAfterContentInit(): void {
        setTimeout(()=>{
            const headers = this.elementRef.nativeElement.getElementsByClassName('ui-datatable-scrollable-header-box');
            this.hasHeader = headers.length > 0;
            if (this.hasHeader) {
                this.header = headers[0];
                this.headerTop = this.header.getBoundingClientRect()['top'];
                this._calcPosition();
            }
        }, 0);
    }

    ngOnChanges(changes)
    {
        if (changes.stickyTop || changes.stickyOffsetTop) {
            this._calcPosition();
        }
    }

    ngOnDestroy(){

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
        this.setClass(false);
    }

    private setStyle(key: string, value: string): void {
        this.renderer.setElementStyle(this.header, key, value);
    }

    private setClass(add: boolean): void {
        this.renderer.setElementClass(this.header, this.stickyClass, add);
    }

}
