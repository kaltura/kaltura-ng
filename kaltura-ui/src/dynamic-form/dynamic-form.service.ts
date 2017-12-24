import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators,  FormBuilder } from '@angular/forms';
import { DynamicFormControlBase } from './dynamic-form-control-base';
import { DynamicSectionControl } from './controls/dynamic-section-control';


@Injectable()
export class DynamicFormService {
    constructor(private _formBuilder : FormBuilder) { }


    toFormGroup(dynamicControls: DynamicFormControlBase<any>[], config : { ignoreMultiple? : boolean, formValue? : {} } = {} ) : FormGroup {
        let result: any = {};

        if (dynamicControls) {
            dynamicControls.forEach(formControl => {

                if (!config.ignoreMultiple && formControl.allowMultiple) {
                    const formArray = result[formControl.key] = this._formBuilder.array([]);

                    if (config && config.formValue) {
                        // build array formGroup item for each actual record in array
                        const arrayItems = config.formValue[formControl.key];

                        if (arrayItems instanceof Array) {
                            arrayItems.forEach(arrayItem => {
                                formArray.push(this.toFormGroup([formControl], {
                                    ignoreMultiple: true,
                                    formValue: arrayItem
                                }));
                            });
                        }
                    }
                } else {
                    if (formControl instanceof DynamicSectionControl) {
                        const shouldCreateNestedGroup = dynamicControls.length > 1;
                        if (shouldCreateNestedGroup) {
                            result[formControl.key] = this.toFormGroup(formControl.children, {formValue: config.formValue});
                        }else {
                            result = this.toFormGroup(formControl.children, {formValue: config.formValue});
                        }
                    } else {
                        result[formControl.key] = new FormControl(formControl.defaultValue || null, formControl.validators);
                    }
                }

            });
        }

        return (result instanceof FormGroup) ? result : this._formBuilder.group(result);
    }
}
