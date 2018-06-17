import { DynamicFormControlBase, DynamicFormControlArgs } from '../dynamic-form-control-base';

export interface DynamicSectionArgs extends DynamicFormControlArgs<any>
{
    children : DynamicFormControlBase<any>[];
}


export class DynamicSectionControl extends DynamicFormControlBase<any> {

    get controlType() : string
    {
        return 'Group';
    }

    public children : DynamicFormControlBase<any>[];

    constructor(options: DynamicSectionArgs)
    {
        super(options);
        this.children = options.children;
    }

}