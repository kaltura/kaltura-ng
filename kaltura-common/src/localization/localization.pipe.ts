import { Pipe, PipeTransform } from '@angular/core';

import { AppLocalization } from './app-localization.service';

@Pipe({
    name: 'translate'
})
export class LocalizationPipe implements PipeTransform {
    value: string = '';
    constructor(private appLocalization: AppLocalization){}

    transform(query: string, interpolateParams?: Object): any {
        return this.appLocalization.get(query, interpolateParams);
  }
}
