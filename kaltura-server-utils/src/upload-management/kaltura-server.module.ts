import { NgModule } from '@angular/core';
import { KalturaClientModule } from '@kaltura-ng/kaltura-client';
import { UploadFileAdapterToken, UploadManagementModule } from '@kaltura-ng/kaltura-common';
import { KalturaServerAdapter } from './kaltura-server-adapter';

@NgModule({
    imports: <any[]>[
        KalturaClientModule,
        UploadManagementModule
    ],
    declarations: <any[]>[
    ],
    exports: <any[]>[
    ],
    providers: <any[]>[
        {
            provide : UploadFileAdapterToken,
            useClass : KalturaServerAdapter,
            multi : true
        }
    ]
})
export class KalturaServerModule {

}
