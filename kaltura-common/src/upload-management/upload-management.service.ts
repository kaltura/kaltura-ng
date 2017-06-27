import { Injectable, Optional } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import '../rxjs/add/operators';
import { UploadFileAdapter, UploadStatus } from './upload-file-adapter';
import { UploadFile } from './upload-file';
import { KalturaOVPFile } from './kaltura-ovp/kaltura-ovp-file';
import { KalturaOVPAdapter } from './kaltura-ovp/kaltura-ovp-adapter';

export type FileChangesStatus = "uploading" | "uploaded" | "uploadFailure";

export interface FileChanges
{
    [uploadToken : string] : {
        status : FileChangesStatus,
        progress?: number,
        failureReason? : string
    }
};

@Injectable()
export class UploadManagement {
    private _trackedFiles: BehaviorSubject<FileChanges> = new BehaviorSubject<FileChanges>({});
    public trackedFiles = this._trackedFiles.monitor('get upload files state');

    constructor(@Optional() private _uploadFileAdapter: UploadFileAdapter) {

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

    private _initiateNewUpload(uploadAdapter : UploadFileAdapter, uploadToken : string, fileData : UploadFile) : void
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

    private _getUploadAdapter(fileData: UploadFile): UploadFileAdapter {
        if (fileData instanceof KalturaOVPFile && this._uploadFileAdapter instanceof KalturaOVPAdapter) {
            // currently supporting only kaltura vamb file uploads,
            // can extend later in this function to support more destinations such as OTT servers
            return this._uploadFileAdapter;
        } else {
            return null;
        }
    }

}