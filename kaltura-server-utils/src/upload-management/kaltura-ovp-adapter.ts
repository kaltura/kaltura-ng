import { Injectable } from '@angular/core';
import { UploadFileAdapter, UploadStatus, UploadFile } from '@kaltura-ng/kaltura-common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { KalturaClient } from '@kaltura-ng/kaltura-client';
import { UploadTokenAddAction } from 'kaltura-typescript-client/types/UploadTokenAddAction';
import { UploadTokenUploadAction } from 'kaltura-typescript-client/types/UploadTokenUploadAction';
import { KalturaUploadToken } from 'kaltura-typescript-client/types/KalturaUploadToken';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import { KalturaOVPFile } from './kaltura-ovp-file';


@Injectable()
export class KalturaOVPAdapter extends UploadFileAdapter
{
    constructor(private _serverClient : KalturaClient){
        super();
    }

    getUploadToken(uploadFile : UploadFile) : Observable<{ uploadToken : string}>
    {
        return this._serverClient.request(
            new UploadTokenAddAction({
                uploadToken : new KalturaUploadToken()
            })
        )
            .monitor('get upload token')
            .map(
            (response) =>
            {
                return { uploadToken : response.id};
            }
        );
    }

    newUpload(uploadToken : string, uploadFile : UploadFile) : Observable<{ uploadToken : string, status : UploadStatus,  progress? : number}>
    {

        if (uploadToken && uploadFile && uploadFile instanceof KalturaOVPFile) {
            return Observable.create((observer) => {

            this._serverClient.request(
                new UploadTokenUploadAction(
                    {
                        uploadTokenId: uploadToken,
                        fileData : uploadFile.file
                    }
                ).setProgress(
                    (uploaded, total) =>
                    {
                        const progress = total && total !== 0 ? uploaded/total : null;
                        observer.next({ uploadToken, status: 'uploading', progress});
                    }
                )
            ).subscribe(
                () =>
                {
                    observer.next({ uploadToken, status: 'uploaded'});
                    observer._complete();
                },
                (error) =>
                {
                    observer.error(error);
                }
            );

            }).monitor(`upload with token ${uploadToken}`);
        }else {
            return Observable.throw(new Error('missing upload token and content'));
        }
    }

}