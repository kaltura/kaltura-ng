import { Observable } from 'rxjs/Observable';
import { UploadFile } from './upload-file';

export type UploadStatus = 'uploading' | 'uploaded';

export abstract class UploadFileAdapter{
    abstract getUploadToken(uploadFile : UploadFile) : Observable<{ uploadToken : string}>;
    abstract newUpload(uploadToken : string, uploadFile : UploadFile) : Observable<{ uploadToken : string, status : UploadStatus,  progress? : number}>;
}