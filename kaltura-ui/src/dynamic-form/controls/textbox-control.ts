import { DynamicFormControlBase, DynamicFormControlArgs } from '../dynamic-form-control-base';

// can extend with more types taken from 'https://www.w3schools.com/tags/att_input_type.asp'
export type InputTypes = 'text' | 'checkbox' | 'file' | 'hidden' | 'image' | 'password';
export type InputHTML5Types = 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' ;
export type TextboxTypes =  InputTypes | InputHTML5Types;

export interface TextboxControlArgs extends DynamicFormControlArgs<string>
{
    type? : TextboxTypes;
}

export class TextboxControl extends DynamicFormControlBase<string> {
    get controlType()
    {
        return 'Textbox';
    }

    type: string;

    constructor(options: TextboxControlArgs) {
        super(options);
        this.type = options['type'] || '';
    }
}
