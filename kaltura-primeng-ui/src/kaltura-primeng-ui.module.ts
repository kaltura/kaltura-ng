import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule, MenuModule } from 'primeng/primeng';
import { FillHeightDirective } from './directives/datatable-fillheight';
import { DropdownCloseOnScroll } from './directives/dropdown-close-on-scroll';
import { MenuCloseOnScroll } from './directives/menu-close-on-scroll';

/**
 * @deprecated use separated module for each component
 */
@NgModule({
    imports: <any[]>[
        CommonModule, InputTextModule, MenuModule
    ],
    declarations: <any[]>[
        FillHeightDirective,
	    DropdownCloseOnScroll,
	    MenuCloseOnScroll
    ],
    exports: <any[]>[
        FillHeightDirective,
	    DropdownCloseOnScroll,
	    MenuCloseOnScroll
    ],
    providers: <any[]>[
    ]
})
export class KalturaPrimeNgUIModule {}
