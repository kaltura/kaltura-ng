import { DynamicFormControlBase, DynamicFormControlArgs } from '../dynamic-form-control-base';

export interface LinkedEntriesControlArgs extends DynamicFormControlArgs<any>
{
    allowMultipleEntries : boolean;
}

export class LinkedEntriesControl extends DynamicFormControlBase<any> {
    get controlType()
    {
        return 'LinkedEntries';
    }

    allowMultipleEntries : boolean;

    constructor(options: LinkedEntriesControlArgs) {
        super(options);
        this.allowMultipleEntries = options.allowMultipleEntries;
    }
}
