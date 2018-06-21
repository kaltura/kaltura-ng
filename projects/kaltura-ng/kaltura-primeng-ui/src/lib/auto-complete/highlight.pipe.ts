import { Pipe, PipeTransform } from '@angular/core';

const escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

@Pipe({
    name: 'kHighlight'
})
export class HighlightPipe implements PipeTransform {
    transform(value: string, arg: string): string {
        if (!arg.trim()) {
            return value;
        }

        try {
            const regex = new RegExp(`(${escape(arg)})`, 'i');
            return value.replace(regex, '<span class="kHighlightedText">$1</span>');
        } catch (e) {
            return value;
        }
    }
}
