import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from 'ng2-translate/ng2-translate';

import { KalturaUtils } from './utils/kaltura-utils';
import { AppStorage } from './app-storage.service';
import { AppLocalization, LocalizationPipe } from './localization/index';


@NgModule({
    imports: <any[]>[
        CommonModule,
        TranslateModule
    ],
    declarations: <any[]>[
        LocalizationPipe
    ],
    exports: <any[]>[
        LocalizationPipe
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
                AppStorage,
                AppLocalization,
	            KalturaUtils
            ]
        };
    }
}
