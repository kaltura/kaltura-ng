import { UploadFileData } from './upload-file-data';
import { ISubscription } from 'rxjs/Subscription';

export type TrackedFileStatus = string

export class TrackedFileStatuses {
    public static readonly added: TrackedFileStatus = 'added'; // one-time status, cannot be assigned twice
    public static readonly pendingPrepare: TrackedFileStatus = 'pendingPrepare';
    public static readonly preparing: TrackedFileStatus = 'preparing';
    public static readonly prepared: TrackedFileStatus = 'prepared'; // one-time status, cannot be assigned twice
    public static readonly pendingUpload: TrackedFileStatus = 'waitingUpload';
    public static readonly uploading: TrackedFileStatus = 'uploading';
    public static readonly uploadCompleted: TrackedFileStatus = 'uploadCompleted'; // one-time status, cannot be assigned twice
    public static readonly failure: TrackedFileStatus = 'failure';
    public static readonly cancelled: TrackedFileStatus = 'cancelled';
    public static readonly purged: TrackedFileStatus = 'purged';  // one-time status, cannot be assigned twice
}

export interface TrackedFileData
{
    id: string;
    status: TrackedFileStatus;
    uploadStartAt: Date;
    progress: number;
    uploadCompleteAt?: Date;
    uploadOrder: number;
    failureType?: string;
    failureReason?: string;
    data: UploadFileData;
}

export interface TrackedFileChanges
{
    status?: TrackedFileStatus;
    uploadStartAt?: Date;
    progress?: number;
    uploadCompleteAt?: Date;
    uploadOrder?: number;
    failureType?: string;
    failureReason?: string;
}

export class TrackedFile {
    private _id: string;
    public get id():string{
        return this._id;
    }
    status: TrackedFileStatus = TrackedFileStatuses.added;
    uploadStartAt?: Date;
    progress: number =  0;
    uploadCompleteAt: Date = null;
    uploadOrder: number = 0;
    failureType: string;
    failureReason: string;
    data: UploadFileData;
    uploadSubscription: ISubscription;
    private _statusHistory : { [key:string] : boolean } = {
        'added' : true
    };

    constructor(id: string, data: UploadFileData)
    {
        this._id = id;
        this.data = data;
    }

    public asData() : TrackedFileData{
        return {
            id: this.id,
            status: this.status,
            uploadStartAt: this.uploadStartAt,
            progress: this.progress,
            uploadCompleteAt: this.uploadCompleteAt,
            uploadOrder: this.uploadOrder,
            failureType: this.failureType,
            failureReason: this.failureReason,
            data: this.data
        };
    }

    public update(changes: TrackedFileChanges): void
    {
        if (changes.status && changes.status !== this.status) {
            if (!this.canTransitionTo(changes.status))
            {
                throw new Error(`file ${this.id}: cannot update status to '${changes.status}'`);
            }

            this._statusHistory[changes.status] = true;
        }

        Object.assign(this,changes);
    }

    public wasInStatus(status: TrackedFileStatus): boolean
    {
        return !!this._statusHistory[status];
    }

    public canTransitionTo(toStatus: string) : boolean {
        let result: boolean = false;
        const trackedFile = this;
        const fromStatus = trackedFile ? trackedFile.status : null;

        if (trackedFile  && fromStatus && toStatus) {

            if (fromStatus === TrackedFileStatuses.purged)
            {
                // never allow changing status once file was purged
                result = false;
            }

            switch (toStatus) {
                case TrackedFileStatuses.added:
                    // one-time status, cannot be assigned twice
                    result = !this.wasInStatus(TrackedFileStatuses.added);
                    break;
                case TrackedFileStatuses.pendingPrepare:
                    result = !this.wasInStatus(TrackedFileStatuses.prepared);
                    break;
                case TrackedFileStatuses.preparing:
                    result = !this.wasInStatus(TrackedFileStatuses.prepared)
                        && fromStatus === TrackedFileStatuses.pendingPrepare;
                    break;
                case TrackedFileStatuses.prepared:
                    // one-time status, cannot be assigned twice
                    result = !this.wasInStatus(TrackedFileStatuses.prepared)
                        && fromStatus === TrackedFileStatuses.preparing;
                    break;
                case TrackedFileStatuses.pendingUpload:
                    result = this.wasInStatus(TrackedFileStatuses.prepared)
                        && !this.wasInStatus(TrackedFileStatuses.uploadCompleted);
                    break;
                case TrackedFileStatuses.uploading:
                    result = !this.wasInStatus(TrackedFileStatuses.uploadCompleted)
                        && fromStatus === TrackedFileStatuses.pendingUpload;
                    break;
                case TrackedFileStatuses.uploadCompleted:
                    // one-time status, cannot be assigned twice
                    result = !this.wasInStatus(TrackedFileStatuses.uploadCompleted)
                        && fromStatus === TrackedFileStatuses.uploading;
                    break;
                case TrackedFileStatuses.cancelled:
                    result = ([TrackedFileStatuses.cancelled, TrackedFileStatuses.uploadCompleted, TrackedFileStatuses.purged].indexOf(fromStatus) === -1);
                    break;
                case TrackedFileStatuses.failure:
                    // always allow changing to 'failure' status (assuming 'purge' is handled separately before)
                    result = ([TrackedFileStatuses.uploadCompleted, TrackedFileStatuses.purged].indexOf(fromStatus) === -1);
                    break;
                case TrackedFileStatuses.purged:
                    // one-time status, cannot be assigned twice
                    result = !this.wasInStatus(TrackedFileStatuses.purged);
                    break;
                default:
                    throw new Error(`unknown status provided '${toStatus}'`);
            }
        }

        return result;
    }

}
