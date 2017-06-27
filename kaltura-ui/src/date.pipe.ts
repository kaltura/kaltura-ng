import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
    name: 'kDate'
})
export class DatePipe implements PipeTransform {

    constructor(){}

    transform(date: number, format : string): any {
        if (date) {
            if (!format) {
                format = "L HH:mm";
            }

            return moment(date).format(format);
        }else
        {
            return '';
        }
    }
}
