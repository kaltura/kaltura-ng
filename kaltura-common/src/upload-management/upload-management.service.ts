import { OnDestroy, Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import '../rxjs/add/operators';
import { UploadFileData } from './upload-file-data';
import { UploadFileAdapter } from './upload-file-adapter';
import { Subject } from 'rxjs/Subject';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/groupBy';
import { FriendlyHashId } from '../friendly-hash-id';

export enum TrackedFileStatuses {
    uploading,
    uploadCompleted,
    uploadFailed,
    added,
    waitingUpload,
    cancelled,
    purged,
    preparing
}

export interface TrackedFile {
    id: string,
    status: TrackedFileStatuses,
    uploadStartAt?: Date,
    progress?: number,
    uploadCompleteAt?: Date,
    uploadOrder?: number;
    failureType?: string,
    failureReason?: string,
    data: UploadFileData
}

export interface TrackedFiles {
    [id: string]: TrackedFile
};

interface TrackedFileUploadData {
    [id: string]: {
        uploadSubscription: ISubscription,
        preparing: boolean
    }
}

export const UploadFileAdapterToken = new InjectionToken<string>('upload-file-adapter');

@Injectable()
export class UploadManagement implements OnDestroy {
    private _trackedFiles: TrackedFiles = {};
    private _trackedFilesUploadData: TrackedFileUploadData = {};
    private _onFileStatusChanged = new Subject<TrackedFile>();
    private _maxUploadRequests: number = null;
    public onFileStatusChanged$ = this._onFileStatusChanged.asObservable();
    private _tokenGenerator = new FriendlyHashId();

    constructor(@Inject(UploadFileAdapterToken) @Optional() private _uploadFileAdapter: UploadFileAdapter<any>[]) {

    }

    public setMaxUploadRequests(maxUploads?: number): void {
        if (maxUploads === null || maxUploads > 0) {
            this._log('info', `limit max upload requests to ${maxUploads}`);
            this._maxUploadRequests = maxUploads;
        } else {
            this._log('info', `remove max upload limitation`);
            this._maxUploadRequests = null;
        }
    }

    // TODO [kmcng] replace this function with log library
    private _log(level: 'silly' | 'debug' | 'info' | 'warn' | 'error', message: string, context?: string): void {
        const messageContext = context || 'general';
        const origin = 'upload manager';
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

    public getTrackedFiles(): TrackedFile[]
    {
        return Object.values(this._trackedFiles);
    }

    public addFile(file: UploadFileData): { id: string } {
        const [newFileId] = this.addFiles([file]);
        return newFileId;
    }

    public addFiles(files: UploadFileData[]): { id: string, data: UploadFileData }[] {

        const result: { id: string, data: UploadFileData }[] = [];

        files.forEach((fileData) => {
            this._log('info', `add new file to upload named '${fileData.getFileName()}'`);
            const newUploadId = this._tokenGenerator.generateUnique(Object.keys(this._trackedFiles));

            this._log('info', `generated unique upload id '${newUploadId}'. adding file to queue`);
            this._createTrackedFile(newUploadId, fileData);

            result.push({id: newUploadId, data: fileData});
        });

        if (result.length)
        {
            this._syncUploadQueue();
        }


        return result;
    }

    public cancelUploadWithError(id: string, reason: string) : void {
        this._log('info', `cancel upload for file '${id}' with reason '${reason}'`);

        this.cancelUpload(id, false);

        const trackedFile = this._trackedFiles[id];

        if ([TrackedFileStatuses.cancelled, TrackedFileStatuses.uploadFailed].indexOf(trackedFile.status) !== -1) {
            {
                this._updateTrackedFile(trackedFile,
                    {
                        status: TrackedFileStatuses.cancelled,
                        failureReason: reason || 'unknown error',
                        failureType: 'manual_error'
                    }
                );
            }
        }
    }

    public cancelUpload(id: string, purge: boolean= true): void {
        this._log('info', `cancel upload for file '${id}'`);

        const trackedFile = this._trackedFiles[id];

        if (trackedFile) {
            if (this._trackedFilesUploadData[id].uploadSubscription) {
                this._trackedFilesUploadData[id].uploadSubscription.unsubscribe();
                this._trackedFilesUploadData[id].uploadSubscription = null;
            }

            if ([TrackedFileStatuses.preparing, TrackedFileStatuses.waitingUpload, TrackedFileStatuses.uploading].includes(trackedFile.status)) {
                this._updateTrackedFile(trackedFile,
                    {
                        status: TrackedFileStatuses.cancelled
                    });
            }

            if (purge) {
                this.purgeUpload(id);
            }

            this._syncUploadQueue();
        }else
        {
            this._log('warn', `cannot find file '${id}', ignoring cancel request`);
        }

    }

    public purgeUpload(id: string): void {

        this._log('info', `purging upload for file '${id}'`);

        const trackedFile = this._trackedFiles[id];

        if (trackedFile) {
            if (trackedFile.status !== TrackedFileStatuses.cancelled) {
                this.cancelUpload(id, false);
            }

            this._updateTrackedFile(id, {status: TrackedFileStatuses.purged});

            this._removeTrackedFile(id);
        }else
        {
            this._log('warn', `cannot find file '${id}', ignoring purge request`);

        }
    }

    private _removeTrackedFile(id: string) {
        this._log('info', `removed tracking for file '${id}`);

        // Developer notice - This function should be used only once upload complete or purged so usually the uploadSubscription
        // should be null, so this is a cleanup function just in case.
        const trackedFileUploadData = this._trackedFilesUploadData[id];
        if (trackedFileUploadData.uploadSubscription) {
            trackedFileUploadData.uploadSubscription.unsubscribe();
            trackedFileUploadData.uploadSubscription = null;
        }
        delete this._trackedFiles[id];
        delete this._trackedFilesUploadData[id];
    }

    syncUploadQueueTimeoutId : number;

    private _syncUploadQueue(): void {
        this._log('info', `request to sync upload queue`);

        if (this.syncUploadQueueTimeoutId) {
            clearTimeout(this.syncUploadQueueTimeoutId);
            this.syncUploadQueueTimeoutId = null;
        }

        // DEVELOPER NOTICE: This logic is delayed to the next event loop on purpose to prevent
        // collision between two sync requests
        this.syncUploadQueueTimeoutId = setTimeout(() => {
            this._log('info', `checking for pending upload files`);
            this.syncUploadQueueTimeoutId = null;

            // group relevant files by status
            const trackedFilesByStatus = Object.values(this._trackedFiles).reduce((acc, curr) => {
                if ([TrackedFileStatuses.uploading, TrackedFileStatuses.waitingUpload, TrackedFileStatuses.added].includes(curr.status)) {
                    const statusItems = acc[curr.status];

                    if (statusItems) {
                        statusItems.push(curr);
                    } else {
                        acc[curr.status] = [curr];
                    }
                }

                return acc;
            }, {});


            const activeUploads = (trackedFilesByStatus[TrackedFileStatuses.uploading] || []);
            const pendingFiles = (trackedFilesByStatus[TrackedFileStatuses.waitingUpload] || []);
            const addedFiles = (trackedFilesByStatus[TrackedFileStatuses.added] || []);

            if (addedFiles.length > 0) {
                this._handlePendingPrepareFiles(addedFiles);
            }

            if (pendingFiles.length > 0) {
                this._handleWaitingFiles(activeUploads, pendingFiles);
            }
        }, 200);
    }

    private _handlePendingPrepareFiles(addedFiles: TrackedFile[]): void {
        this._log('silly', '_handlePendingPrepareFiles()');

        const addedFilesWaitingForPrepare = Object.values(addedFiles)
            .filter(addedFile => (!this._trackedFilesUploadData[addedFile.id].preparing));

        if (addedFilesWaitingForPrepare.length)
        {
            this._log('debug', `files with 'preparing status ${addedFiles.length} | waiting execution '${addedFilesWaitingForPrepare.length} `);

            const groupedFiles = addedFilesWaitingForPrepare.reduce((acc: { adapter: UploadFileAdapter<any>, files: TrackedFile[] }[], curr : TrackedFile) => {
                const uploadAdapter = this._getUploadAdapter(curr.data) || null;

                const matchedItem = acc.find(item => item.adapter ? item.adapter.constructor === uploadAdapter.constructor : item.adapter === null);

                if (matchedItem) {
                    matchedItem.files.push(curr);
                } else {
                    acc.push({adapter: uploadAdapter, files: [curr]});
                }

                return acc;
            }, []);

            groupedFiles.forEach(item => {
                if (item.adapter) {
                    this._log('debug', `executing prepare phase for ${item.files.length} files with adapter '${item.adapter.label}'`);

                    item.adapter.prepare(item.files.map(file => {
                        // Developer notice: although doing side effect in map function is not recommended, this is done here
                        // to improve performance
                        this._trackedFilesUploadData[file.id].preparing = true;

                        return {id: file.id, data: file.data};
                    }))
                        .cancelOnDestroy(this)
                        .subscribe(
                            modifiedFiles => {

                                this._handlePrepareAdapterResponse(modifiedFiles);

                                this._syncUploadQueue();
                            },
                            reason => {

                                this._handlePrepareAdapterResponse(item.files.map(file =>
                                    ({ id: file.id, status:false})));

                                this._syncUploadQueue();
                            });

                }
                else {
                    item.files.forEach(file => {
                        this._updateTrackedFile(file,
                            {
                                status: TrackedFileStatuses.uploadFailed,
                                failureReason: 'upload destination is not supported',
                                failureType: 'unknown_destination'
                            })
                    })
                }
            });
        }
    }

    private _handlePrepareAdapterResponse(modifiedFiles : { id: string, status:boolean}[]) : void{
        modifiedFiles.forEach(
            modifiedFile => {
                const trackedFile = this._trackedFiles[modifiedFile.id];
                const trackedFileUploadData = this._trackedFilesUploadData[modifiedFile.id];

                if (trackedFileUploadData) {
                    trackedFileUploadData.preparing = false;
                }

                if (trackedFile) {
                    if (modifiedFile.status) {
                        if (trackedFile.status === TrackedFileStatuses.added) {
                            // if upload status is not preparing, don't change status to prevent wierd scenarios
                            this._updateTrackedFile(trackedFile,
                                {
                                    status: TrackedFileStatuses.waitingUpload
                                });
                        } else {
                            this._log('warn', `ignoring prepare response for file '${modifiedFile.id}' since the file status not equal 'added' (did the user cancel the file upload during the prepare execution?)`);
                        }
                    } else {
                        this._updateTrackedFile(trackedFile,
                            {
                                status: TrackedFileStatuses.uploadFailed,
                                failureReason: 'failed to prepare upload',
                                failureType: 'preparation_failed'
                            });
                    }
                } else {
                    this._log('warn', `cannot handle prepare response for file '${modifiedFile.id}' since there is no tracking information for that file (did the user purge the file during the prepare execution?)`);
                }
            }
        );

    }

    private _handleWaitingFiles(activeUploadFiles: TrackedFile[], waitingFiles: TrackedFile[]): void {
        let nextUploadFiles: TrackedFile[] = [];
        const activeUploadsCount = activeUploadFiles.length;
        const waitingFilesCount = waitingFiles.length;

        this._log('silly', `active uploads: ${activeUploadsCount} | pending files: ${waitingFilesCount}`);

        const availableUploadSlots = (this._maxUploadRequests && this._maxUploadRequests > 0) ? this._maxUploadRequests - activeUploadsCount : waitingFilesCount;

        if (availableUploadSlots > 0) {
            nextUploadFiles = waitingFiles.sort(pendingFile => pendingFile.uploadOrder || 1000).slice(0, availableUploadSlots);
        }

        this._log('debug', `available upload slots to be used ${availableUploadSlots}`);

        nextUploadFiles.forEach(pendingFile => {
            this._initiateUpload(pendingFile);
        });
    }


    private _createTrackedFile(id: string, fileData: UploadFileData): void {
        const newTrackedFile = this._trackedFiles[id] = {
            id: id,
            data: fileData,
            status: TrackedFileStatuses.added
        };

         this._trackedFilesUploadData[id] = {uploadSubscription: null, preparing: false};

        this._onFileStatusChanged.next(newTrackedFile);
    }

    private _updateTrackedFile(trackedFile: TrackedFile, changes: Partial<TrackedFile>): void;
    private _updateTrackedFile(id: string, changes: Partial<TrackedFile>): void;
    private _updateTrackedFile(target: TrackedFile | string, changes: Partial<TrackedFile>): void {

        let trackedFile: TrackedFile;
        if (typeof target === 'string') {
            trackedFile = this._trackedFiles[target];

            if (!trackedFile) {
                throw new Error(`missing tracked file  '${target}'. did you remember to create one before trying to update it?`);
            }
        } else {
            trackedFile = target;
        }

        if (changes.status && changes.status !== trackedFile.status) {
            this._log('info', `change upload status for file '${trackedFile.id}' to '${changes.status}'`);
        }

        const newTrackedFile = Object.assign({},
            trackedFile,
            changes);

        this._trackedFiles[trackedFile.id] = newTrackedFile;
        this._onFileStatusChanged.next(newTrackedFile);

    }

    private _initiateUpload(trackedFile: TrackedFile): void {

        const {data, id} = trackedFile;
        const uploadAdapter: UploadFileAdapter<any> = this._getUploadAdapter(data);

        this._log('info', `initiate new upload for file '${id}'`);

        if (!uploadAdapter) {
            this._log('warn', `cannot find destination adapter for requested file, failing upload request`);
            this._updateTrackedFile(trackedFile,
                {
                    status: TrackedFileStatuses.uploadFailed,
                    failureReason: 'upload destination is not supported',
                    failureType: 'unknown_destination'
                });

            this._syncUploadQueue();

        } else if ([TrackedFileStatuses.uploading, TrackedFileStatuses.uploadCompleted].includes(trackedFile.status)) {
            this._log('debug', `upload already in progress or file was already uploaded successfully. ignoring request`);
        } else {
            const activeUploadSubscription = this._trackedFilesUploadData[id].uploadSubscription;

            if (activeUploadSubscription) {
                this._log('warn', `an active upload was found while the status indicated no upload currently in progress. cancel previous upload`);
                activeUploadSubscription.unsubscribe();
                this._trackedFilesUploadData[id].uploadSubscription = null;
            }

            this._updateTrackedFile(trackedFile, {
                status: TrackedFileStatuses.uploading,
                progress: 0,
                uploadStartAt: new Date(),
            });

            this._trackedFilesUploadData[id].uploadSubscription = uploadAdapter.upload(id, data)
                .subscribe(
                    (uploadChanges) => {
                        const trackedFile = this._trackedFiles[id];

                        if (trackedFile) {
                            this._updateTrackedFile(trackedFile,
                                {
                                    status: TrackedFileStatuses.uploading,
                                    progress: uploadChanges.progress
                                });
                        } else {
                            this._log('warn', `got status update for file '${id}', but this file seems to be purged`);
                        }
                    },
                    (error) => {
                        const trackedFile = this._trackedFiles[id];

                        if (trackedFile) {
                            const failureReason = error && error.message ? error.message : '';

                            this._updateTrackedFile(trackedFile,
                                {
                                    status: TrackedFileStatuses.uploadFailed,
                                    failureReason,
                                    failureType: 'general_error'
                                });
                        }

                        this._syncUploadQueue();
                    },
                    () => {
                        const trackedFile = this._trackedFiles[id];

                        if (trackedFile) {
                            this._updateTrackedFile(trackedFile,
                                {
                                    status: TrackedFileStatuses.uploadCompleted,
                                    progress: 1,
                                    uploadCompleteAt: new Date()
                                });

                            this._trackedFilesUploadData[id].uploadSubscription = null;
                            this._removeTrackedFile(trackedFile.id);
                            this._syncUploadQueue();
                        } else {
                            this._log('warn', `got status update for file '${id}', but this file seems to be purged`);
                        }
                    }
                );
        }
    }

    private _getUploadAdapter(fileData: UploadFileData): UploadFileAdapter<any> {

        if (this._uploadFileAdapter) {
            return this._uploadFileAdapter.find(uploadFileAdapter => {
                return uploadFileAdapter.canHandle(fileData);
            });
        } else {
            return null;
        }
    }

    ngOnDestroy(): void {
        Object.keys(this._trackedFilesUploadData).forEach(id =>
        {
            this.purgeUpload(id);
        });
    }


}