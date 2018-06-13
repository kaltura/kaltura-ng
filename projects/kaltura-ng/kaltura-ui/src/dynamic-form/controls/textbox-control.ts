import { DynamicFormControlBase, DynamicFormControlArgs } from '../dynamic-form-control-base';

export class TextboxControl extends DynamicFormControlBase<string> {
    get controlType()
    {
        return 'Textbox';
    }

    constructor(options: DynamicFormControlArgs<string>) {
        super(options);
    }
}
