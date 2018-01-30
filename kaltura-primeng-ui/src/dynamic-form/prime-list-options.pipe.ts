import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'kPrimeListOptions'
})
export class PrimeListOptionsPipe implements PipeTransform {

    constructor(){}

    transform(values : any[]): any {
        return [
            {label: 'Select a value', value: null},
            ...(values || []).map(value => {
                return {label: value.text, value: value.value};
            })
        ];
    }
}
