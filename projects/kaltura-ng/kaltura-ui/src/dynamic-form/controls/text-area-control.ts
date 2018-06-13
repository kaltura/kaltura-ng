import { DynamicFormControlBase, DynamicFormControlArgs } from '../dynamic-form-control-base';

export interface TextAreaControlArgs extends DynamicFormControlArgs<string>
{

}

export class TextAreaControl extends DynamicFormControlBase<string> {
    get controlType()
    {
        return 'TextArea';
    }


    constructor(options: TextAreaControlArgs) {
        super(options);
    }
}
