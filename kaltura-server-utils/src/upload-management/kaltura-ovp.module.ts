import { NgModule } from '@angular/core';
import { KalturaClientModule } from '@kaltura-ng/kaltura-client';
import { UploadFileAdapter } from '@kaltura-ng/kaltura-common';
import { KalturaOVPAdapter } from './kaltura-ovp-adapter';

@NgModule({
    imports: <any[]>[
        KalturaClientModule
    ],
    declarations: <any[]>[
    ],
    exports: <any[]>[
    ],
    providers: <any[]>[
        { provide : UploadFileAdapter, useClass : KalturaOVPAdapter }
    ]
})
export class KalturaOVPModule {

}
