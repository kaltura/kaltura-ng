import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { KalturaClient } from '@kaltura-ng/kaltura-client';
import { ConversionProfileListAction } from 'kaltura-typescript-client/types/ConversionProfileListAction';
import { KalturaConversionProfileFilter } from 'kaltura-typescript-client/types/KalturaConversionProfileFilter';
import { KalturaConversionProfileType } from 'kaltura-typescript-client/types/KalturaConversionProfileType';
import { KalturaFilterPager } from 'kaltura-typescript-client/types/KalturaFilterPager';
import { KalturaConversionProfileListResponse } from 'kaltura-typescript-client/types/KalturaConversionProfileListResponse';
import { KalturaConversionProfile } from 'kaltura-typescript-client/types/KalturaConversionProfile';

@Injectable()
export class TranscodingProfileManagement {
  private _trancodingProfileCache$;

  constructor(private _serverClient: KalturaClient) {

  }

  private _loadTrancsodingProfiles(): Observable<KalturaConversionProfile[]> {
    const payload = new ConversionProfileListAction({
      filter: new KalturaConversionProfileFilter({ typeEqual: KalturaConversionProfileType.media }),
      pager: new KalturaFilterPager({ pageSize: 500 })
    });

    return this._serverClient
      .request(new ConversionProfileListAction(payload))
      .map((res: KalturaConversionProfileListResponse) => res.objects);
  }

  public get(cache = true): Observable<KalturaConversionProfile[]> {
    if (!cache) {
      return this._loadTrancsodingProfiles();
    }

    if (!this._trancodingProfileCache$) {
      this._trancodingProfileCache$ = this._loadTrancsodingProfiles()
        .publishReplay(1)
        .refCount();
    }

    return this._trancodingProfileCache$;
  }

  public clearCache(): void {
    this._trancodingProfileCache$ = null;
  }

}