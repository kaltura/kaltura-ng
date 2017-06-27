import { Injectable } from '@angular/core';
import { PartnerProfileStore } from '../partner-profile';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { KalturaClient } from '@kaltura-ng/kaltura-client';
import { KalturaMetadataObjectType } from 'kaltura-typescript-client/types/KalturaMetadataObjectType';
import { MetadataProfileListAction } from 'kaltura-typescript-client/types/MetadataProfileListAction';
import { MetadataProfileParser } from './kaltura-metadata-parser';
import { KalturaMetadataProfileCreateMode } from 'kaltura-typescript-client/types/KalturaMetadataProfileCreateMode';
import { KalturaMetadataProfileFilter } from 'kaltura-typescript-client/types/KalturaMetadataProfileFilter';
import { KalturaMetadataProfileListResponse } from 'kaltura-typescript-client/types/KalturaMetadataProfileListResponse';

import { MetadataProfile } from './metadata-profile';

export enum MetadataProfileCreateModes {
    Api,
    App,
    Kmc
}

export enum MetadataProfileTypes {
    Entry
}

export interface GetFilters
{
    type : MetadataProfileTypes;
    ignoredCreateMode : MetadataProfileCreateModes
}

@Injectable()
export class MetadataProfileStore extends PartnerProfileStore
{
    private _cachedProfiles : { [key : string] : MetadataProfile[]} = {};

    constructor(private _kalturaServerClient: KalturaClient) {
        super();
    }

    public get(filters : GetFilters) : Observable<{items : MetadataProfile[]}>
    {
        return Observable.create(observer =>
        {
	        let sub: ISubscription;
            const cacheKey = this._createCacheKey(filters);
            const cachedResults = this._cachedProfiles[cacheKey];
            if (cachedResults)
            {
                observer.next({items : cachedResults});
                observer.complete();
            }else {
                    sub = this._buildGetRequest(filters).subscribe(
                    response =>
                    {
                    	sub = null;
                        const parser = new MetadataProfileParser();
                        const parsedProfiles = [];
                        let parseFirstError : Error = null;

                        response.objects.forEach(kalturaProfile =>
                        {
                            const parsedProfile = parser.parse(<any>kalturaProfile);
                            if (parsedProfile.error)
                            {
                                parseFirstError = parsedProfile.error;
                            }else
                            {
                                parsedProfiles.push(parsedProfile.profile);
                            }
                        });

                        if (parseFirstError) {
                            observer.error(parseFirstError);
                        }else
                        {
                            this._cachedProfiles[cacheKey] = parsedProfiles;
                            observer.next({items: parsedProfiles});
                            observer.complete();
                        }
                    },
                    error =>
                    {
                    	sub = null;
                        observer.error(error);
                    }
                );
            }
            return () =>{
            	if (sub) {
		            sub.unsubscribe();
	            }
            }
        });

    }

    private _createCacheKey(filters : GetFilters)
    {
        if (filters) {
            return `_${filters.type ? filters.type : ''}_${filters.ignoredCreateMode ? filters.ignoredCreateMode : ''}_` ;
        } else {
            return 'all';
        }
    }

    private _getAPICreateMode(createMode : MetadataProfileCreateModes) : KalturaMetadataProfileCreateMode
    {
        let result : KalturaMetadataProfileCreateMode;

        switch (createMode)
        {
            case MetadataProfileCreateModes.Api:
                result = KalturaMetadataProfileCreateMode.api;
                break;
            case MetadataProfileCreateModes.App:
                result = KalturaMetadataProfileCreateMode.app;
                break;
            case MetadataProfileCreateModes.Kmc:
                result = KalturaMetadataProfileCreateMode.kmc;
                break;
            default:
        }

        return result;
    }

    private _buildGetRequest(filters : GetFilters): Observable<KalturaMetadataProfileListResponse> {
        const metadataProfilesFilter = new KalturaMetadataProfileFilter();
        metadataProfilesFilter.createModeNotEqual = this._getAPICreateMode(filters.ignoredCreateMode);
        metadataProfilesFilter.orderBy = '-createdAt';
        metadataProfilesFilter.metadataObjectTypeEqual = KalturaMetadataObjectType.entry;

        return <any>this._kalturaServerClient.request(new MetadataProfileListAction({
            filter : metadataProfilesFilter
        }));
    }
}
