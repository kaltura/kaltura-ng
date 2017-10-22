import { Directive, Input, Renderer, ElementRef, OnInit, AfterContentInit, OnDestroy, OnChanges, HostListener } from '@angular/core';
import { StickyScrollService } from '@kaltura-ng/kaltura-ui/sticky';
import { StickyDirective } from '@kaltura-ng/kaltura-ui';

@Directive({
    selector: '[kStickyHeader]'
})

export class StickyDatatableHeaderDirective extends StickyDirective {

    private _dataTableRef: ElementRef;
    constructor(elementRef: ElementRef, renderer: Renderer, _stickyScrollService: StickyScrollService) {
        super(elementRef, renderer, _stickyScrollService);
        this._dataTableRef = elementRef;
    }

    protected _getStickyElement(elementRef: ElementRef) :any{
        const headers = elementRef.nativeElement.getElementsByClassName('ui-datatable-scrollable-header-box');

        if (headers && headers.length > 0) {
            // console.log("got primeng table header!");
            return headers[0];
        } else {
            throw new Error("failed to extract table header (did you set the prime table with header?)");
        }
    }

    protected _onSticky():void{
        const boundingClientRect: any = this._dataTableRef.nativeElement.getBoundingClientRect();
        const tableWidth = boundingClientRect['right'] - boundingClientRect['left'];
        this._stickyElement.style.width = tableWidth + 'px';
    }

    protected _onUnsetSticky():void{
        this._stickyElement.style.position = 'static';
        this._stickyElement.style.width = 'auto';
    }

}
