import { Directive, Renderer2, ElementRef } from '@angular/core';
import { StickyScrollService } from '@kaltura-ng/kaltura-ui';
import { StickyDirective } from '@kaltura-ng/kaltura-ui';

@Directive({
    selector: '[kStickyHeader]'
})

export class StickyDatatableHeaderDirective extends StickyDirective {

    private _dataTableRef: ElementRef;
    constructor(elementRef: ElementRef, renderer: Renderer2, _stickyScrollService: StickyScrollService) {
        super(elementRef, renderer, _stickyScrollService);
        this._dataTableRef = elementRef;
    }

    protected _getStickyElement(elementRef: ElementRef) :any{
        const headers = elementRef.nativeElement.querySelectorAll('.p-datatable-scrollable-header-box');

        if (headers && headers.length > 0) {
            return headers[0];
        } else {
            console.warn("failed to extract table header (did you set the prime table with header and set it to scrollable?)");
            return null;
        }
    }

    protected _onSticky():void{
        this.updateHeaderSize();
    }

    protected _onUnsetSticky():void{
        this._stickyElement.style.position = 'static';
        this._stickyElement.style.width = 'auto';
    }

    protected onResize():void{
        this.updateHeaderSize();
    };

    private updateHeaderSize(){
        if (this.isSticky) {
            const boundingClientRect: any = this._dataTableRef.nativeElement.getBoundingClientRect();
            const tableWidth = boundingClientRect['right'] - boundingClientRect['left'];
            this._stickyElement.style.width = tableWidth + 'px';
        }
    }

}
