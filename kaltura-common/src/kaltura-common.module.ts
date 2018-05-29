import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KalturaUtils } from './utils/kaltura-utils';
import { APP_STORAGE_TOKEN, AppStorage } from './app-storage.service';


@NgModule({
    imports: <any[]>[
        CommonModule,
    ],
    declarations: <any[]>[
    ],
    exports: <any[]>[
    ],
    providers: <any[]>[
        ]
})
export class KalturaCommonModule {
    // constructor(@Optional() @SkipSelf() module : KalturaCoreModule, private appBootstrap : AppBootstrap)
    // {
    //     if (module) {
    //         throw new Error("KMCngCoreModule module imported twice.");
    //     }
    // }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: KalturaCommonModule,
            providers: [
                { provide: APP_STORAGE_TOKEN, useClass: AppStorage },
	            KalturaUtils
            ]
        };
    }
}
