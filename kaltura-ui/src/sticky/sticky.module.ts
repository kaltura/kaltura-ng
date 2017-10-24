import { ModuleWithProviders, NgModule } from '@angular/core';
import { KalturaCommonModule } from '@kaltura-ng/kaltura-common';
import { StickyComponent } from './components/sticky.component';
import { ScrollToTopComponent } from './components/scroll-to-top.component';
import { StickyDirective} from './directives/sticky.directive';
import { StickyScrollService } from './services/sticky-scroll.service';

@NgModule({
    imports: <any[]>[
        KalturaCommonModule
    ],
    declarations: <any[]>[
        StickyComponent,
        StickyDirective,
        ScrollToTopComponent
    ],
    exports: <any[]>[
        StickyComponent,
        StickyDirective,
        ScrollToTopComponent
    ],
    providers: <any[]>[
    ]
})
export class StickyModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: StickyModule,
            providers: <any[]>[
                StickyScrollService
            ]
        };
    }

}
