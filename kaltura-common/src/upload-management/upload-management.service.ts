import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import '../rxjs/add/operators';
import { UploadFileAdapterBase, UploadStatus } from './upload-file-adapter-base';
import { UploadFile } from './upload-file';

export type FileChangesStatus = "uploading" | "uploaded" | "uploadFailure";

export interface FileChanges
{
    [uploadToken : string] : {
        status : FileChangesStatus,
        progress?: number,
        failureReason? : string
    }
};

export const UploadFileAdapterToken = new InjectionToken<string>('upload-file-adapter');

@Injectable()
export class UploadManagement {
    private _trackedFiles: BehaviorSubject<FileChanges> = new BehaviorSubject<FileChanges>({});
    public trackedFiles = this._trackedFiles.monitor('get upload files state');

    constructor(@Inject(UploadFileAdapterToken) @Optional()  private _uploadFileAdapter: UploadFileAdapterBase[]) {

    }

    public newUpload(fileData: UploadFile): Observable<{ uploadToken: string}> {
        return Observable.create((observer) => {
            const uploadAdapter = this._getUploadAdapter(fileData);

            if (uploadAdapter) {
                uploadAdapter.getUploadToken(fileData)
                    .subscribe(
                        (response) => {

                            this._initiateNewUpload(uploadAdapter, response.uploadToken, fileData);

                            observer.next(response);
                            observer.complete();
                        },
                        (error) => {
                            observer.error(new Error(error.message));
                        }
                    );
            } else {
                observer.error(new Error(`cannot upload file, requested file type is not supported (did you remember to register a relevant adapter for '${typeof fileData}'?)`));
            }
        });
    }

    private _initiateNewUpload(uploadAdapter : UploadFileAdapterBase, uploadToken : string, fileData : UploadFile) : void
    {
        uploadAdapter.newUpload(uploadToken, fileData)
            .subscribe(
                (uploadProgress) => {
                    const trackData = this._trackedFiles.getValue();

                    switch (uploadProgress.status) {
                        case 'uploading':
                            trackData[uploadToken] = {
                                status: "uploading",
                                progress: uploadProgress.progress
                            };
                            this._trackedFiles.next(trackData);
                            break;
                        case 'uploaded':
                            trackData[uploadToken] = {status: 'uploaded'};
                            this._trackedFiles.next(trackData);
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    const trackData = this._trackedFiles.getValue();
                    const failureReason = error && error.message ? error.message : '';
                    trackData[uploadToken] = {status: 'uploadFailure', failureReason };
                    this._trackedFiles.next(trackData);
                }
            );

    }

    private _getUploadAdapter(fileData: UploadFile): UploadFileAdapterBase {

        if (this._uploadFileAdapter) {
            return this._uploadFileAdapter.find(uploadFileAdapter => {
                return uploadFileAdapter.canHandle(fileData);
            });
        }else {
            return null;
        }
    }

}