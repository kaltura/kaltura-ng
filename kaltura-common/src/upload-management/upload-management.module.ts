import { NgModule } from '@angular/core';
import { UploadManagement } from './upload-management.service';
import { KalturaClientModule } from '@kaltura-ng/kaltura-client';
import { KalturaOVPAdapter } from './kaltura-ovp/kaltura-ovp-adapter';
import { UploadFileAdapter } from './upload-file-adapter';

@NgModule({
    imports: <any[]>[
        KalturaClientModule
    ],
    declarations: <any[]>[
    ],
    exports: <any[]>[
    ],
    providers: <any[]>[
        UploadManagement,
        { provide : UploadFileAdapter, useClass : KalturaOVPAdapter }
    ]
})
export class UploadManagementModule {

}
