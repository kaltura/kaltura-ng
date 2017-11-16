import { Observable } from 'rxjs/Observable';
import { UploadFileData } from './upload-file-data';


export abstract class UploadFileAdapter<T extends UploadFileData>{
    abstract get label() : string;
    abstract prepare(files : {id: string, data : T}[]) : Observable<{id: string, status: boolean}[]>;
    abstract upload(id: string, data : T) : Observable<{ id : string, progress? : number}>;
    abstract canHandle(uploadFile : UploadFileData) : boolean;
    abstract supportChunkUpload(): boolean;
}