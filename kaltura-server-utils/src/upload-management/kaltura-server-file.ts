import { UploadFile } from '@kaltura-ng/kaltura-common';
export class KalturaServerFile implements UploadFile
{

    constructor(public file : File)
    {

    }
}

