import { Injectable } from '@angular/core';
import { UploadFileAdapterBase, UploadStatus, UploadFile } from '@kaltura-ng/kaltura-common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { KalturaClient } from '@kaltura-ng/kaltura-client';
import { UploadTokenAddAction } from 'kaltura-typescript-client/types/UploadTokenAddAction';
import { UploadTokenUploadAction } from 'kaltura-typescript-client/types/UploadTokenUploadAction';
import { KalturaUploadToken } from 'kaltura-typescript-client/types/KalturaUploadToken';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import { KalturaServerFile } from './kaltura-server-file';


@Injectable()
export class KalturaServerAdapter extends UploadFileAdapterBase
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
    canHandle(uploadFile : UploadFile) : boolean
    {
        return uploadFile instanceof KalturaServerFile;
    }

    newUpload(uploadToken : string, uploadFile : UploadFile) : Observable<{ uploadToken : string, status : UploadStatus,  progress? : number}>
    {

        if (uploadToken && uploadFile && uploadFile instanceof KalturaServerFile) {
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