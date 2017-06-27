import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'kPrimeListOptions'
})
export class PrimeListOptionsPipe implements PipeTransform {

    constructor(){}

    transform(values : any[], isRequired : boolean = true ): any {

        const result = [];

        if (!isRequired)
        {
            result.push({label:'', value : null});
        }

        values && values.forEach(value =>
        {
            result.push({ label : value.text, value : value.value });
        });

        return result;
    }
}
