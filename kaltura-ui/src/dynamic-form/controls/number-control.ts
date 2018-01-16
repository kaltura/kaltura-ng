import { DynamicFormControlBase, DynamicFormControlArgs } from '../dynamic-form-control-base';

export class NumberControl extends DynamicFormControlBase<string> {
    get controlType()
    {
        return 'Number';
    }

    constructor(options: DynamicFormControlArgs<string>) {
        super(options);
    }
}
