import { DynamicFormControlBase, DynamicFormControlArgs } from '../dynamic-form-control-base';

export interface DatePickerControlArgs extends DynamicFormControlArgs<Date>
{
    showTime? : boolean;
}

export class DatePickerControl extends DynamicFormControlBase<Date> {
    get controlType()
    {
        return 'DatePicker';
    }

    showTime : boolean = false;

    constructor(options: DatePickerControlArgs) {
        super(options);
        this.showTime = options.showTime;
    }
}
