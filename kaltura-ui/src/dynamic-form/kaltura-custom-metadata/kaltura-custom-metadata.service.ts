import { Injectable } from '@angular/core';
import { MetadataProfile } from '@kaltura-ng/kaltura-common/metadata-profile';
import { DynamicFormService } from '../dynamic-form.service';
import { KalturaCustomDataHandler } from './kaltura-custom-data-handler';

@Injectable()
export class KalturaCustomMetadata{

    constructor(private _dynamicFormService : DynamicFormService){
    }

    createHandler( metadataProfile : MetadataProfile) : KalturaCustomDataHandler
    {
        return new KalturaCustomDataHandler(metadataProfile, this._dynamicFormService);
    }
}