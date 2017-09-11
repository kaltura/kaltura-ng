import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import '../rxjs/add/operators';
import { UploadFileAdapter, UploadFile } from './upload-file';
import { Subject } from 'rxjs/Subject';
import { ISubscription, Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/groupBy';

export interface TrackedFile
{
    uploadToken: string,
    status : "uploading" | "uploaded" | "uploadFailure" | "pending" | "cancelled" | "removed",
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

export interface UploadingFileSubscriptions {
    [uploadToken: string]: ISubscription
}

export const UploadFileAdapterToken = new InjectionToken<string>('upload-file-adapter');

@Injectable()
export class UploadManagement {
    private _trackedFiles : TrackedFiles = {};
    private _uploadingFileSubscriptions: UploadingFileSubscriptions = {};
    private _onTrackFileChange = new Subject<TrackedFile>();
    private _maxUploadRequests : number = null;
    public onTrackFileChange$ = this._onTrackFileChange.asObservable().monitor('tracked file state change');

    constructor(@Inject(UploadFileAdapterToken) @Optional()  private _uploadFileAdapter: UploadFileAdapter<any>[]) {

    }

    public setMaxUploadRequests(maxUploads? : number) : void {
        if (maxUploads === null || maxUploads > 0)
        {
            this._maxUploadRequests = maxUploads;
        }
    }

    public newUpload(fileData: UploadFile): Observable<{ uploadToken: string}> {
        return Observable.create((observer) => {
            const uploadAdapter = this._getUploadAdapter(fileData);

            if (uploadAdapter) {
                uploadAdapter.getUploadToken(fileData)
                    .subscribe(
                        (response) => {

                            // create new track file
                            this._updateTrackedFile(response, {
                                response,
                                fileName : fileData.getFileName(),
                                fileSize : fileData.getFileSize(),
                                status: "pending"
                            });

                            this._syncPendingQueue();

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

    public cancelUpload(uploadToken: string): void {
        const uploadSubscription = this._uploadingFileSubscriptions[uploadToken];
        const trackedFile = this._trackedFiles[uploadToken];
        const isSubscription = uploadSubscription instanceof Subscription;

        if (trackedFile && trackedFile.status === 'uploading')
        {
            this._updateTrackedFile(trackedFile,{
                status : 'cancelled'
            });
        }

        if (isSubscription) {
            uploadSubscription.unsubscribe();
            delete this._uploadingFileSubscriptions[uploadToken];
        }
    }

    public purgeUpload(uploadToken : string): void {
        this.cancelUpload(uploadToken);

        this._updateTrackedFile(uploadToken,{ status: 'removed'});

        delete this._trackedFiles[uploadToken];
    }

    private _onUploadCompleted(uploadToken : string) : void{


    }

    private _syncPendingQueue() : void{
        debugger;
        Observable.of(this._trackedFiles)
            .groupBy(trackedFile => trackedFile.status)
            .map(
                trackedFilesByStatus =>
                {
                    let result : TrackedFile[] = [];
                    const activeUploadsCount = (trackedFilesByStatus['uploading'] || []).length;
                    const pendingFiles = (trackedFilesByStatus['pending'] || []);
                    const pendingFilesCount = pendingFiles.length;
                    if (pendingFilesCount > 0)
                    {
                        const availableUploadSlots = (this._maxUploadRequests && this._maxUploadRequests > 0) ? this._maxUploadRequests - activeUploadsCount : pendingFilesCount;

                        if (availableUploadSlots > 0)
                        {
                            result = pendingFiles.sort(pendingFile => pendingFile.uploadOrder).slice(0,availableUploadSlots);
                        }
                    }

                    return result;
                }
            )
            .subscribe(
                pendingFilesData =>
                {
                    // TODO
                    const activeUpload = 0;
                    if (!this._maxUploadRequests || (this._maxUploadRequests > 0 && activeUpload < this._maxUploadRequests)) {
                        this._initiateNewUpload(uploadAdapter, response.uploadToken, fileData);
                    }
                    pendingFilesData.forEach(pendingFile =>
                    {
                        this._initiateNewUpload(uploadAdapter, response.uploadToken, fileData);
                    });
                }
            )
    }

    private _getActiveUploadCount() : number {
        return Object.keys(this._trackedFiles).filter(trackedFile => trackedFile.status === 'uploading').length;
    }

    private _updateTrackedFile(trackedFile : TrackedFile, changes : Partial<TrackedFile>) : void;
    private _updateTrackedFile(uploadToken : string, changes : Partial<TrackedFile>) : void;
    private _updateTrackedFile(target : TrackedFile | string, changes : Partial<TrackedFile>) : void{

        let trackedFile: TrackedFile;
        if (typeof target === 'string')
        {
            trackedFile = this._trackedFiles[target];
        }else
        {
            trackedFile = target;
        }

        const newTrackedFile = Object.assign({},
            trackedFile,
            changes);

        this._trackedFiles[trackedFile.uploadToken] = newTrackedFile;
        this._onTrackFileChange.next(newTrackedFile);
    }

    private _initiateNewUpload(uploadAdapter : UploadFileAdapter<any>, uploadToken : string, fileData : UploadFile) : void {
        if (this._trackedFiles[uploadToken]) {
            throw new Error(`cannot initiate new upload token '${uploadToken}', token is already in use`);
        }

        this._uploadingFileSubscriptions[uploadToken] = uploadAdapter.newUpload(uploadToken, fileData)
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

                                this._onUploadCompleted(uploadToken);
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

                    this._onUploadCompleted(uploadToken);

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