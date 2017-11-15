import { OnDestroy, Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import '../rxjs/add/operators';
import { UploadFileData } from './upload-file-data';
import { UploadFileAdapter } from './upload-file-adapter';
import { Subject } from 'rxjs/Subject';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/groupBy';
import { FriendlyHashId } from '../friendly-hash-id';
import { TrackedFile, TrackedFileChanges, TrackedFileData, TrackedFileStatuses } from './tracked-file';


export interface TrackedFiles {
    [id: string]: TrackedFile
}

export const UploadFileAdapterToken = new InjectionToken<string>('upload-file-adapter');

@Injectable()
export class UploadManagement implements OnDestroy {
    private _trackedFiles: TrackedFiles = {};
    private _onTrackedFileChanged = new Subject<TrackedFileData>();
    private _maxUploadRequests: number = null;
    public onTrackedFileChanged$ = this._onTrackedFileChanged.asObservable();
    private _tokenGenerator = new FriendlyHashId();
    syncUploadQueueTimeoutId : number;

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
    private _log(level: 'silly' | 'debug' | 'info' | 'warn' | 'error', message: string, fileId?: string): void {
        const messageContext = fileId ? `file '${fileId}'` : '';
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

    public getTrackedFile(fileId: string): TrackedFileData {
        const relevantFile = this._trackedFiles[fileId];
        return relevantFile ? relevantFile.asData() : null;
    }

    public getTrackedFiles(): TrackedFileData[]
    {
        return Object.values(this._trackedFiles).map(file => file.asData());
    }

    public getTrackedFile(fileId: string): TrackedFileData
    {
        const relevantFile = this._trackedFiles[fileId];
        return relevantFile? relevantFile.asData() : null;
    }

    public addFile(file: UploadFileData): { id: string } {
        const [newFileId] = this.addFiles([file]);
        return newFileId;
    }

    public addFiles(files: UploadFileData[]): { id: string, data: UploadFileData }[] {

        const result: { id: string, data: UploadFileData }[] = [];

        files.forEach((fileData) => {

            const newUploadId = this._tokenGenerator.generateUnique(Object.keys(this._trackedFiles));

            this._log('info', `add new file '${fileData.getFileName()}' to queue with unique file id`,newUploadId);
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
        this._log('info', `cancel file upload with custom reason '${reason}'`,id);

        const trackedFile = this._trackedFiles[id];

        if (trackedFile) {
            {
                if (trackedFile.canTransitionTo(TrackedFileStatuses.cancelled)) {
                    this.cancelUpload(id, false);

                    this._updateTrackedFile(trackedFile,
                        {
                            status: TrackedFileStatuses.cancelled,
                            failureReason: reason || 'unknown error',
                            failureType: 'manual_error'
                        }
                    );
                }
            }
        }else
        {
            this._log('warn','cannot cancel upload, failed to find file with provided id',id);
        }
    }


    public resumeUpload(id: string): void {
      this.resumeUploads([id]);
    }

    public resumeUploads(files: string[]): void {
        let syncUploadQueue = false;

        files.forEach(id => {
            this._log('info', `resume file upload.`, id);
            const trackedFile = this._trackedFiles[id];

            if (trackedFile) {
                if (trackedFile.wasInStatus(TrackedFileStatuses.prepared)) {
                    this._updateTrackedFile(trackedFile, {
                        status: TrackedFileStatuses.pendingUpload
                    });
                } else {
                    this._updateTrackedFile(trackedFile, {
                        status: TrackedFileStatuses.pendingPrepare
                    });
                }
            } else {
                this._log('warn', 'cannot resume upload, failed to find file with provided id', id);
            }
        });

        this._syncUploadQueue();
    }

    public cancelUpload(id: string, purge: boolean= true): void {
        this._log('info', `cancel file upload.`, id);

        const trackedFile = this._trackedFiles[id];

        if (trackedFile) {
            if (trackedFile.status !== TrackedFileStatuses.cancelled
                && trackedFile.canTransitionTo(TrackedFileStatuses.cancelled))
            {
                if (trackedFile.uploadSubscription) {
                    trackedFile.uploadSubscription.unsubscribe();
                    trackedFile.uploadSubscription = null;
                }

                this._updateTrackedFile(trackedFile,
                    {
                        status: TrackedFileStatuses.cancelled
                    });

                if (purge) {
                    this.purgeUpload(id);
                }

                this._syncUploadQueue();
            }
        }else
        {
            this._log('warn', 'cannot cancel upload, failed to find file with provided id', id);
        }
    }

    public purgeUpload(id: string): void {

        this._log('info', `purge file from queue.`, id);

        const trackedFile = this._trackedFiles[id];

        if (trackedFile)
        {
            if (trackedFile.canTransitionTo(TrackedFileStatuses.purged)) {

                this.cancelUpload(id, false);

                this._updateTrackedFile(trackedFile, {status: TrackedFileStatuses.purged});

                this._removeTrackedFile(trackedFile);
            }
        }else
        {
            this._log('warn', 'cannot purge upload, failed to find file with provided id', id);
        }
    }

    private _removeTrackedFile(trackedFile: TrackedFile) {
        this._log('info', `remove tracked file from queue`, trackedFile.id);

        // Developer notice - this is a cleanup function just in case.
        if (trackedFile.uploadSubscription) {
            trackedFile.uploadSubscription.unsubscribe();
            trackedFile.uploadSubscription = null;
        }

        delete this._trackedFiles[trackedFile.id];
    }

    private _syncUploadQueue(): void {
        if (this.syncUploadQueueTimeoutId) {
            clearTimeout(this.syncUploadQueueTimeoutId);
            this.syncUploadQueueTimeoutId = null;
        }

        // DEVELOPER NOTICE: This logic is delayed to the next event loop on purpose to prevent
        // collision between two sync requests
        this.syncUploadQueueTimeoutId = setTimeout(() => {
            this._log('info', `syncing upload queue`);
            this.syncUploadQueueTimeoutId = null;
            this._executePreparePhase();
            this._executeUploadPhase();
        }, 200);
    }

    private _executePreparePhase(): void {

        let filesAlreadyInProcess = 0;
        const files = Object.values(this._trackedFiles).filter(trackedFile =>
            trackedFile.status === TrackedFileStatuses.pendingPrepare
        && trackedFile.canTransitionTo(TrackedFileStatuses.preparing));

        if (files.length)
        {
            this._log('info',`handling ${files.length} files, waiting to be prepared`);

            const groupedFiles = files.reduce((acc: { adapter: UploadFileAdapter<any>, files: TrackedFile[] }[], curr : TrackedFile) => {
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

                    item.files.forEach(file =>
                    {
                        this._updateTrackedFile(file,{ status : TrackedFileStatuses.preparing});
                    });

                    item.adapter.prepare(item.files)
                        .cancelOnDestroy(this)
                        .subscribe(
                            preparedFiles => {
                                this._log('debug', `executing prepare phase succeeded for ${item.files.length} files with adapter '${item.adapter.label}'.`);
                                this._handlePrepareAdapterResponse(preparedFiles);

                                this._syncUploadQueue();
                            },
                            reason => {

                                this._log('error', `executing prepare phase failed for ${item.files.length} files with adapter '${item.adapter.label}'. error: ${reason.message}`);

                                this._handlePrepareAdapterResponse(
                                    item.files.map(file =>({ id: file.id, status:false}))
                                );

                                this._syncUploadQueue();
                            });

                }
                else {
                    item.files.forEach(file => {
                        this._updateTrackedFile(file,
                            {
                                status: TrackedFileStatuses.failure,
                                failureReason: 'upload destination is not supported',
                                failureType: 'unknown_destination'
                            })
                    })
                }
            });
        }
    }

    private _handlePrepareAdapterResponse(responseFiles : { id: string, status:boolean}[]) : void {
        responseFiles.forEach(
            responseFile => {
                const trackedFile = this._trackedFiles[responseFile.id];

                if (!trackedFile) {
                    this._log('warn', `cannot handle prepare response for file '${responseFile.id}' since there is no tracking information for that file (did the user purge the file during the prepare execution?)`);
                }
                else if (trackedFile.status !== TrackedFileStatuses.preparing) {
                    this._log('warn', `cannot handle file result from prepare action (did the user cancel the file upload during the prepare execution?)`, trackedFile.id);
                } else if (responseFile.status) {
                    const changedStatusToPrepared = this._updateTrackedFile(trackedFile,
                        {
                            status: TrackedFileStatuses.prepared
                        });

                    if (changedStatusToPrepared) {
                        this._updateTrackedFile(trackedFile,
                            {
                                status: TrackedFileStatuses.pendingUpload
                            });
                    }
                } else {
                    this._updateTrackedFile(trackedFile,
                        {
                            status: TrackedFileStatuses.failure,
                            failureReason: 'failed to prepare upload',
                            failureType: 'preparation_failed'
                        });
                }
            });
    }

    private _executeUploadPhase(): void {
        const waitingForUploadsFiles = [];
        const activeUploadFiles = [];

        Object.values(this._trackedFiles).forEach(trackedFile =>
        {
            if (trackedFile.status === TrackedFileStatuses.uploading)
            {
                activeUploadFiles.push(trackedFile);
            }else if (trackedFile.status === TrackedFileStatuses.pendingUpload
                && trackedFile.canTransitionTo(TrackedFileStatuses.uploading))
            {
                waitingForUploadsFiles.push(trackedFile);
            }
        });

        const activeUploadsCount = activeUploadFiles.length;
        const waitingFilesCount = waitingForUploadsFiles.length;

        if (waitingFilesCount > 0) {
            let nextUploadFiles: TrackedFile[] = [];

            this._log('silly', `active uploads: ${activeUploadsCount} | pending files: ${waitingFilesCount}`);

            const availableUploadSlots = (this._maxUploadRequests && this._maxUploadRequests > 0) ? this._maxUploadRequests - activeUploadsCount : waitingFilesCount;

            if (availableUploadSlots > 0) {
                nextUploadFiles = [
                    ...waitingForUploadsFiles.sort(pendingFile => pendingFile.uploadOrder || 1000)
                ].slice(0, availableUploadSlots);
            }

            this._log('debug', `available upload slots to be used ${availableUploadSlots}`);


            nextUploadFiles.forEach(pendingFile => {
                this._initiateUpload(pendingFile);
            });
        }
    }

    private _createTrackedFile(id: string, fileData: UploadFileData): void {
        const newTrackedFile = this._trackedFiles[id] = new TrackedFile(id, fileData);

        this._onTrackedFileChanged.next(newTrackedFile.asData());

        this._updateTrackedFile(newTrackedFile,
            {status: TrackedFileStatuses.pendingPrepare}
        );
    }

    private _updateTrackedFile(trackedFile: TrackedFile, changes: TrackedFileChanges): boolean {

        let result = true;

        if (changes.status && changes.status !== trackedFile.status) {


            if (trackedFile.canTransitionTo(changes.status))
            {
                this._log('info', `notify file status changes from '${trackedFile.status}' to '${changes.status}'`,trackedFile.id);
                trackedFile.update(changes);
            }else
            {
                this._log('error', `cannot update file data from '${trackedFile.status}' to '${changes.status}. target status is not allowed. update to status 'failure' instead.`,trackedFile.id);

                trackedFile.update({
                    status: TrackedFileStatuses.failure,
                    failureReason: 'cannot change status',
                    failureType: 'change_not_allowed'
                });

                result = false;
            }
        }else
        {
            //this._log('info', `notify file data changes`,trackedFile.id);
            trackedFile.update(changes)
        }

        this._onTrackedFileChanged.next(trackedFile.asData());

        return result;
    }

    public supportChunkUpload(uploadFileData: UploadFileData) : boolean {
        const uploadAdapter: UploadFileAdapter<any> = this._getUploadAdapter(uploadFileData);
        return uploadAdapter ? uploadAdapter.supportChunkUpload() : false;
    }

    private _initiateUpload(trackedFile: TrackedFile): void {

        const {data, id} = trackedFile;
        const uploadAdapter: UploadFileAdapter<any> = this._getUploadAdapter(data);

        this._log('info', `initiate new upload for file '${id}'`);

        if (!uploadAdapter) {
            this._log('warn', `cannot find destination adapter for requested file, failing upload request`);
            this._updateTrackedFile(trackedFile,
                {
                    status: TrackedFileStatuses.failure,
                    failureReason: 'upload destination is not supported',
                    failureType: 'unknown_destination'
                });

            this._syncUploadQueue();

        } else if (trackedFile.canTransitionTo(TrackedFileStatuses.uploading)) {
            if (trackedFile.uploadSubscription) {
                this._log('warn', `an active upload was found while the status indicated no upload currently in progress. cancel previous upload`);
                trackedFile.uploadSubscription.unsubscribe();
                trackedFile.uploadSubscription = null;
            }

            this._updateTrackedFile(trackedFile, {
                status: TrackedFileStatuses.uploading,
                progress: 0,
                uploadStartAt: new Date(),
            });

            const canHandleResponse = (id: string, actionDescription: string) : boolean =>
            {
                let result = false;
                const trackedFileStillExists = !!this._trackedFiles[id];

                if (!trackedFileStillExists) {
                    this._log('warn', `cannot handle file upload ${actionDescription}. There is no tracking file with the provided id (was the file purged?)`, id);
                } else if (trackedFile.status !== TrackedFileStatuses.uploading) {
                    this._log('warn', `cannot handle file upload ${actionDescription}. The file status it not 'uploading' (was the file upload cancelled?)`, id);
                }else {
                    result = true;
                }

                return result;
            };

            trackedFile.uploadSubscription = uploadAdapter.upload(id, data)
                .subscribe(
                    (uploadChanges) => {
                        if (canHandleResponse(id, 'progress'))
                        {
                            this._updateTrackedFile(trackedFile,
                                {
                                    progress: uploadChanges.progress
                                });
                        }
                    },
                    (error) => {
                        trackedFile.uploadSubscription = null;

                        if (canHandleResponse(id, 'failure')) {
                            const failureReason = error && error.message ? error.message : '';

                            this._updateTrackedFile(trackedFile,
                                {
                                    status: TrackedFileStatuses.failure,
                                    failureReason,
                                    failureType: 'general_error'
                                });
                        }

                        this._syncUploadQueue();
                    },
                    () => {
                        trackedFile.uploadSubscription = null;

                        if (canHandleResponse(id, 'completion')) {
                            this._updateTrackedFile(trackedFile,
                                {
                                    status: TrackedFileStatuses.uploadCompleted,
                                    progress: 1,
                                    uploadCompleteAt: new Date()
                                });

                            this._removeTrackedFile(trackedFile);
                            this._syncUploadQueue();
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
        Object.keys(this._trackedFiles).forEach(id =>
        {
            this.purgeUpload(id);
        });
    }
}