import { Observable } from 'rxjs/Observable';

export type UploadStatus = 'uploading' | 'uploaded';

export interface UploadFile
{
    getFileName() : string;
    getFileSize() : number;
}


export abstract class UploadFileAdapter<T extends UploadFile>{
    abstract get label() : string;
    abstract getUploadToken(uploadFile : T) : Observable<{ uploadToken : string}>;
    abstract newUpload(uploadToken : string, uploadFile : T) : Observable<{ uploadToken : string, status : UploadStatus,  progress? : number}>;
    abstract canHandle(uploadFile : UploadFile) : boolean;
}