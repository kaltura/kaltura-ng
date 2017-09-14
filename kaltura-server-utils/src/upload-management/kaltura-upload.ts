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
    serverUploadToken : string;

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
export class KalturaUploadAdapter<T extends KalturaUploadFile>  extends UploadFileAdapter<T> {
    constructor(private _serverClient: KalturaClient) {
        super();
    }

    // TODO [kmcng] replace this function with log library
    private _log(level: 'silly'|'debug'|'info'|'warn'|'error', message: string,context?: string): void {
        const messageContext = context || 'general';
        const origin = 'ovp upload file adapter';
        const formattedMessage = `log: [${level}] [${origin}] ${messageContext}: ${message}`;
        switch(level)
        {
            case 'silly':
            case 'debug':
            case 'info':
                console.log(formattedMessage);
                break;
            case 'warn':
                console.warn(formattedMessage);
                break;
            case 'error':
                console.error(formattedMessage);
                break;
        }
    }

    get label(): string {
        return 'Kaltura OVP server'
    }

    private _getUploadToken(uploadFile: T): Observable<string> {

        return this._serverClient.request(
            new UploadTokenAddAction({
                uploadToken: new KalturaUploadToken()
            })
        )
            .monitor('get upload token')
            .map(
                (response) => {
                    return response.id;
                }
            );
    }

    canHandle(uploadFile: UploadFile): boolean {
        return uploadFile instanceof KalturaUploadFile;
    }

    upload(uploadToken: string, uploadFile: T): Observable<{ uploadToken: string, status: UploadStatus, progress?: number }> {
        return Observable.create((observer) => {
            if (uploadFile && uploadFile instanceof KalturaUploadFile) {
                this._log('info',`starting upload for file with (client) upload token '${uploadToken}'`);
                let requestSubscription = Observable.of(uploadFile)
                    .mergeMap(
                        uploadFile =>
                        {
                            if (uploadFile.serverUploadToken)
                            {
                                this._log('info',`file already has server upload token, use this one to upload to server`);
                                return Observable.of({ serverUploadToken : uploadFile.serverUploadToken, newToken : false});
                            }else
                            {
                                this._log('info',`getting ovp server upload token for file`);
                                return this._getUploadToken(uploadFile)
                                    .do(serverUploadToken =>
                                    {
                                        this._log('info',`got (server) upload token '${serverUploadToken}' for file with (client) upload token '${uploadToken}'`);

                                        uploadFile.serverUploadToken = serverUploadToken;
                                    })
                                    .map(serverUploadToken => ({ serverUploadToken, newToken: true}));
                            }
                        }
                    )
                    .mergeMap(
                        serverUploadData =>
                        {
                            if (serverUploadData.newToken)
                            {
                                return this._serverClient.request(
                                    new UploadTokenUploadAction(
                                        {
                                            uploadTokenId: serverUploadData.serverUploadToken,
                                            fileData: uploadFile.file
                                        }
                                    ).setProgress(
                                        (uploaded, total) => {
                                            const progress = total && total !== 0 ? uploaded / total : null;
                                            observer.next({uploadToken, status: 'uploading', progress});
                                        }
                                    )
                                )
                            }else
                            {
                                return Observable.throw(new Error('resume upload not supported yet'));
                            }

                        }
                    )
                    .subscribe(
                    () => {
                        requestSubscription = null;
                        this._log('info',`file upload completed for file with upload token '${uploadToken}'`);
                        observer.next({uploadToken, status: 'uploaded'});
                        observer._complete();
                    },
                    (error) => {
                        requestSubscription = null;
                        this._log('error',`file upload failed for file with upload token '${uploadToken}' (reason: ${error.message})`);
                        observer.error(error);
                    }
                );

                return () => {
                    if (requestSubscription) {
                        this._log('info',`cancelling upload file to the server with upload token '${uploadToken}'`);
                        requestSubscription.unsubscribe();
                        requestSubscription = null;
                    }
                };
            } else {
                observer.error(new Error('missing upload token and content'));
            }

        }).monitor(`upload with token ${uploadToken}`);
    }
}