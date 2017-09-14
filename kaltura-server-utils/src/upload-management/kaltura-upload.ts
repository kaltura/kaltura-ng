import { Injectable } from '@angular/core';
import { UploadFile, UploadFileAdapter, UploadStatus } from '@kaltura-ng/kaltura-common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { KalturaClient } from '@kaltura-ng/kaltura-client';
import { UploadTokenAddAction } from 'kaltura-typescript-client/types/UploadTokenAddAction';
import { UploadTokenUploadAction } from 'kaltura-typescript-client/types/UploadTokenUploadAction';
import { KalturaUploadToken } from 'kaltura-typescript-client/types/KalturaUploadToken';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';

export class KalturaUploadFile implements UploadFile
{
    constructor(public file : File)
    {
    }

    getFileName() : string
    {
        return (this.file.name || '').trim();
    }

    getFileSize() : number
    {
        return this.file.size;
    }
}



@Injectable()
export class KalturaUploadAdapter<T extends KalturaUploadFile>  extends UploadFileAdapter<T>
{
    constructor(private _serverClient : KalturaClient){
        super();
    }

    get label() : string{
        return 'Kaltura OVP server'
    }

    getUploadToken(uploadFile : T) : Observable<{ uploadToken : string}>
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
        return uploadFile instanceof KalturaUploadFile;
    }

    newUpload(uploadToken : string, uploadFile : T) : Observable<{ uploadToken : string, status : UploadStatus,  progress? : number}>
    {

        if (uploadToken && uploadFile && uploadFile instanceof KalturaUploadFile) {
            return Observable.create((observer) => {

            let requestSubscription = this._serverClient.request(
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
                    requestSubscription = null;
                    observer.next({ uploadToken, status: 'uploaded'});
                    observer._complete();
                },
                (error) =>
                {
                    requestSubscription = null;
                    observer.error(error);
                }
            );

            return () =>
            {
                if (requestSubscription)
                {
                    requestSubscription.unsubscribe();
                    requestSubscription = null;
                }
            };

            }).monitor(`upload with token ${uploadToken}`);
        }else {
            return Observable.throw(new Error('missing upload token and content'));
        }
    }

}