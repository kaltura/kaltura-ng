import { ValidatorFn } from '@angular/forms';

export interface DynamicFormControlArgs<T>
{
    value?: T,
    key: string,
    label?: string,
    description?: string,
    order?: number,
    allowMultiple? : boolean,
    validators? : Array<ValidatorFn>,
    errors? : {[key: string]: string},
    inputHelperConfig?: {title?: string, body: string}
    styleClass?: string;
    dateFormat?: string;
};

export abstract class DynamicFormControlBase<T>{

    abstract get controlType() : string;
    defaultValue: T;
    key: string;
    label: string;
    allowMultiple : boolean;
    order: number;
    description: string;
    validators : Array<ValidatorFn>;
    errors:  {[key: string]:  string};
    inputHelperConfig: {title?: string, body: string};
    styleClass: string;
    dateFormat?: string;

    constructor(options: DynamicFormControlArgs<T>) {
        this.defaultValue = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.allowMultiple = !!options.allowMultiple;
        this.order = options.order === undefined ? 1 : options.order;
        this.description = options.description || '';
        this.validators = options.validators;
        this.errors = options.errors;
        this.inputHelperConfig = options.inputHelperConfig;
        this.styleClass = options.styleClass;
        this.dateFormat = options.dateFormat;
    }
}
