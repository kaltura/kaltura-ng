import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import '../rxjs/add/operators';
import { UploadFileAdapter, UploadFile } from './upload-file';
import { Subject } from 'rxjs/Subject';
import { ISubscription, Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/groupBy';
import { FriendlyHashId } from '../friendly-hash-id';

export interface TrackedFile
{
    uploadToken: string,
    status : "uploading" | "uploaded" | "uploadFailure" | "pending" | "cancelled" | "removed",
    uploadStartAt? : Date,
    progress?: number,
    fileName : string;
    fileSize : number;
    uploadCompleteAt? : Date,
    failureType? : string,
    failureReason? : string,
    uploadFileData : UploadFile
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
    private _tokenGenerator = new FriendlyHashId();

    constructor(@Inject(UploadFileAdapterToken) @Optional()  private _uploadFileAdapter: UploadFileAdapter<any>[]) {

    }

    public setMaxUploadRequests(maxUploads? : number) : void {
        if (maxUploads === null || maxUploads > 0)
        {
            this._log('info',`limit max upload requests to ${maxUploads}`);
            this._maxUploadRequests = maxUploads;
        }else {
            this._log('info',`remove max upload limitation`);
            this._maxUploadRequests = null;
        }
    }

    // TODO [kmcng] replace this function with log library
    private _log(level: 'silly'|'debug'|'info'|'warn'|'error', message: string,context?: string): void {
        const messageContext = context || 'general';
        const origin = 'upload manager';
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

    // TODO [kmcng] should return {uploadToken: string} instead of observable of that structure
    public newUpload(fileData: UploadFile): Observable<{uploadToken : string}> {

        this._log('info', `add new file to upload named '${fileData.getFileName()}'`);
        const newUploadToken = this._tokenGenerator.generateUnique(Object.keys(this._trackedFiles));

        this._log('info', `generated unique upload token '${newUploadToken}'. adding file to queue`);
        this._createTrackedFile(newUploadToken,fileData);

        this._syncPendingQueue();

        return Observable.of({ uploadToken : newUploadToken });
    }

    public cancelUpload(uploadToken: string): void {

        this._log('silly',`executed for token '${uploadToken}'`,'cancelUpload');

        const uploadSubscription = this._uploadingFileSubscriptions[uploadToken];
        const trackedFile = this._trackedFiles[uploadToken];
        const isSubscription = uploadSubscription instanceof Subscription;

        if (isSubscription) {
            uploadSubscription.unsubscribe();
            delete this._uploadingFileSubscriptions[uploadToken];
        }

        if (trackedFile && ['uploaded','uploadFailure'].indexOf(trackedFile.status) === -1)
        {
            this._updateTrackedFile(trackedFile,{
                status : 'cancelled'
            });
        }

        this._syncPendingQueue();

    }

    public purgeUpload(uploadToken : string): void {
        this._log('info',`purging upload for token '${uploadToken}'`);

        this.cancelUpload(uploadToken);

        this._updateTrackedFile(uploadToken,{ status: 'removed'});

        delete this._trackedFiles[uploadToken];
    }


    private _syncPendingQueue() : void{
        this._log('info',`request to check for pending upload files`);

        // DEVELOPER NOTICE: This logic is delayed to the next event loop on purpose to prevent
        // collision between two sync requests
        setTimeout(() =>
        {
            this._log('info',`checking for pending upload files`);

            const trackedFilesByStatus = Object.values(this._trackedFiles).reduce((acc, curr) =>
            {
                if (curr.status === 'uploading' || curr.status === 'pending') {
                    const statusItems = acc[curr.status];

                    if (statusItems) {
                        statusItems.push(curr);
                    } else {
                        acc[curr.status] = [curr];
                    }
                }

                return acc;
            },{});

            let nextUploadFiles : TrackedFile[] = [];
            const activeUploadsCount = (trackedFilesByStatus['uploading'] || []).length;
            const pendingFiles = (trackedFilesByStatus['pending'] || []);
            const pendingFilesCount = pendingFiles.length;

            this._log('silly',`active uploads: ${activeUploadsCount} | pending files: ${pendingFilesCount}`);

            if (pendingFilesCount > 0)
            {
                const availableUploadSlots = (this._maxUploadRequests && this._maxUploadRequests > 0) ? this._maxUploadRequests - activeUploadsCount : pendingFilesCount;

                if (availableUploadSlots > 0)
                {
                    nextUploadFiles = pendingFiles.sort(pendingFile => pendingFile.uploadOrder).slice(0,availableUploadSlots);
                }

                this._log('debug',`available upload slots to be used ${availableUploadSlots}`);
            }

            nextUploadFiles.forEach(pendingFile =>
            {
                this._initiateUpload(pendingFile);
            });

        },200);
    }

    private _createTrackedFile(uploadToken: string, fileData : UploadFile): void
    {
        this._log('debug',`add tracking file for token '${uploadToken}' with status 'pending'`);
        this._trackedFiles[uploadToken] = {
            uploadToken : uploadToken,
            uploadFileData : fileData,
            fileName : fileData.getFileName(),
            fileSize : fileData.getFileSize(),
            status: "pending"
        };
    }

    private _updateTrackedFile(trackedFile : TrackedFile, changes : Partial<TrackedFile>) : void;
    private _updateTrackedFile(uploadToken : string, changes : Partial<TrackedFile>) : void;
    private _updateTrackedFile(target : TrackedFile | string, changes : Partial<TrackedFile>) : void {

        let trackedFile: TrackedFile;
        if (typeof target === 'string') {
            trackedFile = this._trackedFiles[target];

            if (!trackedFile)
            {
                throw new Error(`missing tracked file for upload token ${target}. did you remember to create one before trying to update it?`);
            }
        } else {
            trackedFile = target;
        }

        if (changes.status && changes.status !== trackedFile.status)
        {
            this._log('info',`change upload status for file '${trackedFile.uploadToken}' to '${changes.status}'`);
        }

        const newTrackedFile = Object.assign({},
            trackedFile,
            changes);

        this._trackedFiles[trackedFile.uploadToken] = newTrackedFile;
        this._onTrackFileChange.next(newTrackedFile);

    }

    private _initiateUpload(trackedFile : TrackedFile) : void {

        const { uploadFileData, uploadToken } = trackedFile;
        const uploadAdapter : UploadFileAdapter<any> = this._getUploadAdapter(uploadFileData);

        this._log('info',`initiate file upload for token '${uploadToken}'`);

        if (!uploadAdapter)
        {
            this._log('warn',`cannot find destination adapter for requested file, failing upload request`);
            this._updateTrackedFile(trackedFile,{
                status : 'uploadFailure',
                failureReason : 'upload destination is not supported',
                failureType: 'unknown_destination'
            });

            this._syncPendingQueue();

        }else if (['uploading','uploaded'].indexOf(trackedFile.status) !== -1) {
            this._log('debug',`upload already in progress or file was already uploaded successfully. ignoring request`);
        } else {
            const activeUploadSubscription = this._uploadingFileSubscriptions[uploadToken];

            if (activeUploadSubscription) {
                this._log('warn',`an active upload was found while the status indicated no upload currently in progress. cancel previous upload`);
                activeUploadSubscription.unsubscribe();
                delete this._uploadingFileSubscriptions[uploadToken];
            }

            this._updateTrackedFile(trackedFile,{
                status: "uploading",
                progress: 0,
                uploadStartAt: new Date(),
            });

            this._uploadingFileSubscriptions[uploadToken] = uploadAdapter.upload(uploadToken, uploadFileData)
                .subscribe(
                    (uploadProgress) => {
                        const trackedFile = this._trackedFiles[uploadToken];

                        if (trackedFile) {
                            switch (uploadProgress.status) {
                                case 'uploading': {
                                    this._updateTrackedFile(trackedFile,{
                                        status: "uploading",
                                        progress: uploadProgress.progress
                                    });
                                }
                                    break;
                                case 'uploaded': {

                                    this._updateTrackedFile(trackedFile,
                                        {
                                            status: "uploaded",
                                            progress: 1,
                                            uploadCompleteAt: new Date()
                                        });

                                    this._syncPendingQueue();
                                }
                                    break;
                                default:
                                    break;
                            }
                        }else
                        {
                            this._log('warn',`got status update for a file with token '${uploadToken}, but this file seems to be purged`);
                        }
                    },
                    (error) => {
                        const trackedFile = this._trackedFiles[uploadToken];

                        if (trackedFile) {
                            const failureReason = error && error.message ? error.message : '';

                            this._updateTrackedFile(trackedFile,{
                                status: "uploadFailure",
                                failureReason,
                                failureType: 'general_error'
                            });
                        }

                        this._syncPendingQueue();
                    }
                );
        }
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