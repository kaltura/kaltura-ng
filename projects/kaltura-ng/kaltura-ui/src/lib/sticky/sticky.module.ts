import { ModuleWithProviders, NgModule } from '@angular/core';
import { KalturaCommonModule } from '@kaltura-ng/kaltura-common';
import { StickyComponent } from './components/sticky.component';
import { StickyDirective} from './directives/sticky.directive';
import { StickyScrollService } from './services/sticky-scroll.service';

@NgModule({
    imports: [
        KalturaCommonModule
    ],
    declarations: [
        StickyComponent,
        StickyDirective
    ],
    exports: [
        StickyComponent,
        StickyDirective
    ],
    providers: [
    ]
})
export class StickyModule {
    static forRoot(): ModuleWithProviders<StickyModule> {
        return {
            ngModule: StickyModule,
            providers: <any[]>[
                StickyScrollService
            ]
        };
    }

}
