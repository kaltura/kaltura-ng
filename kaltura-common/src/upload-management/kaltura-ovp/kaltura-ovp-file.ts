import { UploadFile } from '../upload-file';
export class KalturaOVPFile implements UploadFile
{

    constructor(public file : File)
    {

    }
}

