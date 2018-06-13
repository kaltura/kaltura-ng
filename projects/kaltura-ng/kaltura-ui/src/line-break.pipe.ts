import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'kLineBreak'
})
export class LineBreakPipe implements PipeTransform {

    constructor(){}

    transform(str: string): string {
        if (str.split("\r").length > 0 && str.split("\r\n").length < str.split("\r").length) {
            str = str.split("\r").join("\r\n");
        }
        return str;
    }
}
