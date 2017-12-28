import { DynamicFormControlBase, DynamicFormControlArgs } from '../dynamic-form-control-base';

export class SwitchControl extends DynamicFormControlBase<string> {
    get controlType()
    {
        return 'Switch';
    }

    constructor(options: DynamicFormControlArgs<string>) {
        super(options);
    }
}
