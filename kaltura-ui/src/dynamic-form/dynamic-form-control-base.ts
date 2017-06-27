
export interface DynamicFormControlArgs<T>
{
    value?: T,
    key: string,
    label?: string,
    required?: boolean,
    order?: number,
    allowMultiple? : boolean
};

export abstract class DynamicFormControlBase<T>{

    abstract get controlType() : string;
    defaultValue: T;
    key: string;
    label: string;
    required: boolean;
    allowMultiple : boolean;
    order: number;

    constructor(options: DynamicFormControlArgs<T>) {
        this.defaultValue = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.allowMultiple = !!options.allowMultiple;
        this.order = options.order === undefined ? 1 : options.order;
    }
}
