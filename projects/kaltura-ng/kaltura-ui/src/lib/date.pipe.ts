import { Pipe, PipeTransform } from '@angular/core';
import * as momentNS from 'moment';
const moment = momentNS;


@Pipe({
    name: 'kDate'
})
export class DatePipe implements PipeTransform {

    constructor(){}

    transform(date: number, format : string): any {
        if (date) {
            if (!format) {
                format = "dateAndTime";
            }

            switch (format) {
                case 'dateOnly':
                    format = 'MM/DD/YY';
                    break;
                case 'timeOnly':
                    format = 'HH:mm';
                    break;
                case 'dateAndTime':
                    format = "MM/DD/YY HH:mm";
                    break;
                case 'longDateOnly':
                    format = "MMMM D, YYYY";
                    break;
                default:
                    break;
            }


            return moment(date).format(format);
        }else
        {
            return '';
        }
    }
}
