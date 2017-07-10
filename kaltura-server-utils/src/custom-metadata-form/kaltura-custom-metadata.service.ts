import { Injectable } from '@angular/core';
import { MetadataProfile } from '../custom-metadata';
import { DynamicFormService } from '@kaltura-ng/kaltura-ui/dynamic-form';
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