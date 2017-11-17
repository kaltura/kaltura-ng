import { KalturaAPIException, KalturaRequest } from 'kaltura-typescript-client';
import { Injectable, OnDestroy } from '@angular/core';
import { KalturaClient } from '@kaltura-ng/kaltura-client';
import { Observable } from 'rxjs/Observable';
import { ServerPolls } from '@kaltura-ng/kaltura-common';

// export class BlaRequestPoll extends KalturaRequest<BaseEntryGetAction> {
//
// }
//
// // applciation
// export class bla {
//
//   ngOnInit() {
//     this.ServerPolls.register(10, new BlaRequestPoll())
//       .cancelOnDestroy(this)
//       .subscribe(response => {
//         if (response.error) {
//
//         } else if (response.result instanceof BaseEntryGetActionResult) {
//
//         }
//       })
//   }
// }
//
// kaltura-server-utils
@Injectable()
export class KalturaServerPolls extends ServerPolls<KalturaRequest<any>, KalturaAPIException> implements OnDestroy {
  constructor(private _kalturaClient: KalturaClient) {
    super();
  }

  protected _createGlobalError(): KalturaAPIException {
    return new KalturaAPIException();
  }

  protected _executeRequests(requests: KalturaRequest<any>[]): Observable<{ error: KalturaAPIException, result: any }[]> {
    return this._kalturaClient.multiRequest(requests);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
