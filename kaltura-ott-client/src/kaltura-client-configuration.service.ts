import { Injectable } from '@angular/core';
import { KalturaHttpClientBaseConfiguration } from 'kaltura-ott-typescript-client';


@Injectable()
export class KalturaClientConfiguration implements KalturaHttpClientBaseConfiguration {
    public clientTag: string = '';
    public endpointUrl: string = '';
    constructor() {

    }

}