import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KalturaLogger, KalturaLoggerName } from './kaltura-logger.service';
import { JL } from 'jsnlog';
import { KalturaLoggerRecordService } from './kaltura-logger-record.service';

if (window && window.onerror) {
    window.onerror = null;
}

@NgModule({
    imports: <any[]>[
        CommonModule
    ],
    declarations: <any[]>[

    ],
    exports: <any[]>[
    ],
    providers: <any[]>[
    ]
})
export class KalturaLoggerModule {


    static forRoot(name: string): ModuleWithProviders {
        return {
          ngModule: KalturaLoggerModule,
          providers: [
	          KalturaLogger,
	          {
		          provide: KalturaLoggerName, useValue: name
	          },
            KalturaLoggerRecordService
          ]
        }
    }
}

