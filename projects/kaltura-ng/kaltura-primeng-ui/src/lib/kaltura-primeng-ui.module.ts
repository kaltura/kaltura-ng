import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StickyDatatableHeaderDirective} from './directives/sticky-datatable-header.directive';
import {DropdownCloseOnScroll} from './directives/dropdown-close-on-scroll';
import {MenuCloseOnScroll} from './directives/menu-close-on-scroll';
import {KalturaCommonModule} from '@kaltura-ng/kaltura-common';
import {InputTextModule} from 'primeng/inputtext';
import {MenuModule} from 'primeng/menu';

/**
 * @deprecated use separated module for each component
 */
@NgModule({
  imports: <any[]>[
    CommonModule, InputTextModule, MenuModule, KalturaCommonModule
  ],
  declarations: <any[]>[
    StickyDatatableHeaderDirective,
    DropdownCloseOnScroll,
    MenuCloseOnScroll
  ],
  exports: <any[]>[
    StickyDatatableHeaderDirective,
    DropdownCloseOnScroll,
    MenuCloseOnScroll
  ],
  providers: <any[]>[]
})
export class KalturaPrimeNgUIModule {
}
