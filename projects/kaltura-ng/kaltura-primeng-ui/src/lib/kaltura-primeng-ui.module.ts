import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StickyDatatableHeaderDirective } from './directives/sticky-datatable-header.directive';
import { DropdownCloseOnScroll } from './directives/dropdown-close-on-scroll';
import { MenuCloseOnScroll } from './directives/menu-close-on-scroll';
import { KalturaCommonModule } from '@kaltura-ng/kaltura-common';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';

/**
 * @deprecated use separated module for each component
 */
@NgModule({
    imports: [
        CommonModule, InputTextModule, MenuModule, KalturaCommonModule
    ],
    declarations: [
	    StickyDatatableHeaderDirective,
        DropdownCloseOnScroll,
        MenuCloseOnScroll
    ],
    exports: [
	    StickyDatatableHeaderDirective,
        DropdownCloseOnScroll,
        MenuCloseOnScroll
    ],
    providers: [
    ]
})
export class KalturaPrimeNgUIModule {}
