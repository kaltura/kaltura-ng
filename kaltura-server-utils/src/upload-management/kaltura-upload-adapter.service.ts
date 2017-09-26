import { Injectable } from '@angular/core';
import { UploadFileData, UploadFileAdapter } from '@kaltura-ng/kaltura-common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { KalturaClient } from '@kaltura-ng/kaltura-client';
import { UploadTokenAddAction } from 'kaltura-typescript-client/types/UploadTokenAddAction';
import { UploadTokenUploadAction } from 'kaltura-typescript-client/types/UploadTokenUploadAction';
import { KalturaUploadToken } from 'kaltura-typescript-client/types/KalturaUploadToken';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import { KalturaUploadFile } from './kaltura-upload-file';
import { KalturaRequest } from 'kaltura-typescript-client';

@Injectable()
export class KalturaUploadAdapter extends UploadFileAdapter<KalturaUploadFile> {
    constructor(private _serverClient: KalturaClient) {
        super();
    }

    // TODO [kmcng] replace this function with log library
    private _log(level: 'silly' | 'debug' | 'info' | 'warn' | 'error', message: string, context?: string): void {
        const messageContext = context || 'general';
        const origin = 'ovp upload file adapter';
        const formattedMessage = `log: [${level}] [${origin}] ${messageContext}: ${message}`;
        switch (level) {
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

    private _getUploadToken(uploadFile: KalturaUploadFile): Observable<string> {

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

    prepare(files: { id: string, data: KalturaUploadFile }[]): Observable<{ id: string, status: boolean }[]> {
        const multiRequest: KalturaRequest<any>[] = [];

        files.forEach(file => {
            multiRequest.push(
                new UploadTokenAddAction({
                    uploadToken: new KalturaUploadToken()
                })
            );
        })
        return this._serverClient.multiRequest(multiRequest)
            .map(responses => {
                return files.map((file, index) => {
                    const response = responses[index];
                    let status = !!response.result;

                    if (response.result) {
                        file.data.serverUploadToken = response.result.id;
                        this._log('debug', `updated server upload token to '${response.result.id}' for file '${file.id}`);
                    } else {
                        this._log('warn', `failed to prepare file '${file.id}`);
                    }

                    return {id: file.id, status};
                });
            });
    }

    canHandle(uploadFile: UploadFileData): boolean {
        return uploadFile instanceof KalturaUploadFile;
    }

    upload(id: string, fileData: KalturaUploadFile): Observable<{ id: string, progress?: number }> {
        return Observable.create((observer) => {
            if (fileData && fileData instanceof KalturaUploadFile) {
                this._log('info', `starting upload for file '${id}'`);
                let requestSubscription = this._serverClient.request(
                    new UploadTokenUploadAction(
                        {
                            uploadTokenId: fileData.serverUploadToken,
                            fileData: fileData.file
                        }
                    ).setProgress(
                        (uploaded, total) => {
                            const progress = total && total !== 0 ? uploaded / total : null;
                            observer.next({id: id, progress});
                        }
                    )
                )
                    .subscribe(
                        () => {
                            requestSubscription = null;
                            this._log('info', `file upload completed for file with upload token '${id}'`);
                            observer._complete();
                        },
                        (error) => {
                            requestSubscription = null;
                            this._log('error', `file upload failed for file with upload token '${id}' (reason: ${error.message})`);
                            observer.error(error);
                        }
                    );

                return () => {
                    if (requestSubscription) {
                        this._log('info', `cancelling upload file to the server with upload token '${id}'`);
                        requestSubscription.unsubscribe();
                        requestSubscription = null;
                    }
                };
            } else {
                observer.error(new Error('missing upload token and content'));
            }

        }).monitor(`upload with token ${id}`);
    }
}