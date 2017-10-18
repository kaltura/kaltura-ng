import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule, MenuModule } from 'primeng/primeng';
import { StickyDatatableHeaderDirective } from './directives/sticky-datatable-header.directive';
import { KalturaCommonModule } from '@kaltura-ng/kaltura-common';

/**
 * @deprecated use separated module for each component
 */
@NgModule({
    imports: <any[]>[
        CommonModule, InputTextModule, MenuModule, KalturaCommonModule
    ],
    declarations: <any[]>[
	    StickyDatatableHeaderDirective
    ],
    exports: <any[]>[
	    StickyDatatableHeaderDirective
    ],
    providers: <any[]>[
    ]
})
export class KalturaPrimeNgUIModule {}
