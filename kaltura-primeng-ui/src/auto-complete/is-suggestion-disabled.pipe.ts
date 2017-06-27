import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'kIsSuggestionDisabled'
})
export class IsSuggestionDisabledPipe implements PipeTransform {
    transform(value: any, arg: string): boolean {
        return  (arg && typeof value[arg] === 'boolean' && value[arg] === false);
    }
}

