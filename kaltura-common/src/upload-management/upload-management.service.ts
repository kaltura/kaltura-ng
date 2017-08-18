import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import '../rxjs/add/operators';
import { UploadFileAdapter, UploadFile } from './upload-file';
import { Subject } from 'rxjs/Subject';

export interface TrackedFile
{
    uploadToken: string,
    status : "uploading" | "uploaded" | "uploadFailure" | "pending",
    uploadStartAt? : Date,
    progress?: number,
    fileName : string;
    fileSize : number;
    uploadCompleteAt? : Date,
    failureReason? : string
}

export interface TrackedFiles
{
    [uploadToken : string] : TrackedFile
};

export const UploadFileAdapterToken = new InjectionToken<string>('upload-file-adapter');

@Injectable()
export class UploadManagement {
    private _trackedFiles : TrackedFiles = {};
    private _onTrackFileChange = new Subject<TrackedFile>();
    public onTrackFileChange$ = this._onTrackFileChange.asObservable().monitor('tracked file state change');

    constructor(@Inject(UploadFileAdapterToken) @Optional()  private _uploadFileAdapter: UploadFileAdapter<any>[]) {

    }

    public getTrackedFiles() : TrackedFiles
    {
        return Object.assign({}, this._trackedFiles);
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
                observer.error(new Error(`cannot upload file, requested file type is not supported (did you remember to register a relevant adapter?)`));
            }
        });
    }



    private _initiateNewUpload(uploadAdapter : UploadFileAdapter<any>, uploadToken : string, fileData : UploadFile) : void {
        if (this._trackedFiles[uploadToken]) {
            throw new Error(`cannot initiate new upload token '${uploadToken}', token is already in use`);
        }

        // create new track file
        const newTrackedFile = this._trackedFiles[uploadToken] = {
            uploadToken,
            fileName : fileData.getFileName(),
            fileSize : fileData.getFileSize(),
            status: "pending"
        };

        this._onTrackFileChange.next(newTrackedFile);

        uploadAdapter.newUpload(uploadToken, fileData)
            .subscribe(
                (uploadProgress) => {
                    const trackedFile = this._trackedFiles[uploadToken];

                    if (trackedFile) {
                        switch (uploadProgress.status) {
                            case 'uploading': {
                                const newTrackedFile = this._trackedFiles[uploadToken] = Object.assign({},
                                    trackedFile,
                                    {
                                        status: "uploading",
                                        progress: uploadProgress.progress,
                                        uploadStartAt: trackedFile.uploadStartAt || new Date(),
                                    });
                                this._onTrackFileChange.next(newTrackedFile);
                            }
                                break;
                            case 'uploaded': {
                                const newTrackedFile = this._trackedFiles[uploadToken] = Object.assign({},
                                    trackedFile,
                                    {
                                        status: "uploaded",
                                        progress: 1,
                                        uploadCompleteAt: new Date()
                                    });
                                this._onTrackFileChange.next(newTrackedFile);
                            }
                                break;
                            default:
                                break;
                        }
                    }
                },
                (error) => {
                    const trackedFile = this._trackedFiles[uploadToken];

                    if (trackedFile) {
                        const failureReason = error && error.message ? error.message : '';

                        const newTrackedFile = this._trackedFiles[uploadToken] = Object.assign({},
                            trackedFile,
                            {
                                status: "uploadFailure",
                                failureReason
                            });
                        this._onTrackFileChange.next(newTrackedFile);
                    }

                }
            );
    }

    private _getUploadAdapter(fileData: UploadFile): UploadFileAdapter<any> {

        if (this._uploadFileAdapter) {
            return this._uploadFileAdapter.find(uploadFileAdapter => {
                return uploadFileAdapter.canHandle(fileData);
            });
        }else {
            return null;
        }
    }


}