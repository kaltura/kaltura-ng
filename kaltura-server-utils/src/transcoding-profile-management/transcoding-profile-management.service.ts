import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { KalturaClient } from '@kaltura-ng/kaltura-client';
import { ConversionProfileListAction } from 'kaltura-typescript-client/types/ConversionProfileListAction';
import { KalturaConversionProfileFilter } from 'kaltura-typescript-client/types/KalturaConversionProfileFilter';
import { KalturaConversionProfileType } from 'kaltura-typescript-client/types/KalturaConversionProfileType';
import { KalturaFilterPager } from 'kaltura-typescript-client/types/KalturaFilterPager';
import { KalturaConversionProfileListResponse } from 'kaltura-typescript-client/types/KalturaConversionProfileListResponse';
import { KalturaConversionProfile } from 'kaltura-typescript-client/types/KalturaConversionProfile';

@Injectable()
export class TranscodingProfileManagement {
  private _trancodingProfileCachedResponse: KalturaConversionProfile[];

  constructor(private _serverClient: KalturaClient) {

  }

  private _loadTranscodingProfiles(): Observable<KalturaConversionProfile[]> {
    const payload = new ConversionProfileListAction({
      filter: new KalturaConversionProfileFilter({ typeEqual: KalturaConversionProfileType.media }),
      pager: new KalturaFilterPager({ pageSize: 500 })
    });

    return this._serverClient
      .request(new ConversionProfileListAction(payload))
      .map((res: KalturaConversionProfileListResponse) => res.objects);
  }

  public get(): Observable<KalturaConversionProfile[]> {
    return Observable.create(observer => {
      let requestSubscription;
      if (this._trancodingProfileCachedResponse) {
        observer.next(this._trancodingProfileCachedResponse);
        observer.complete();
      } else {
        requestSubscription = this._loadTranscodingProfiles()
          .subscribe(
            res => {
              requestSubscription = null;
              this._trancodingProfileCachedResponse = res;
              observer.next(this._trancodingProfileCachedResponse);
              observer.complete();
            },
            err => {
              observer.error(err);
              requestSubscription = null;
              this._trancodingProfileCachedResponse = null;
            }
          );
      }

      return () => {
        if (requestSubscription) {
          requestSubscription.unsubscribe();
          requestSubscription = null;
        }
      };
    });
  }

  public clearCache(): void {
    this._trancodingProfileCachedResponse = null;
  }

}