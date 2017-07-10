import { UploadFile } from '@kaltura-ng/kaltura-common';
export class KalturaOVPFile implements UploadFile
{

    constructor(public file : File)
    {

    }
}

