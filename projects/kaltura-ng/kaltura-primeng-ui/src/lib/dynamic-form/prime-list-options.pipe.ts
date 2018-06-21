import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'kPrimeListOptions'
})
export class PrimeListOptionsPipe implements PipeTransform {

    constructor(){}

    transform(values : any[], addDefaultButton: boolean): any {
        const result = (values || []).map(value => {
		    return {label: value.text, value: value.value};
	    });

        if (addDefaultButton) {
	        result.unshift({label: 'Select a value', value: null});
        }

        return result;
    }
}
