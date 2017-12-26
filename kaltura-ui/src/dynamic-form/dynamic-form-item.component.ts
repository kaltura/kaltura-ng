import { Component, Input, TemplateRef, ContentChildren, QueryList, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators,  FormBuilder } from '@angular/forms';
import { DynamicSectionControl } from './controls/dynamic-section-control';
import { DynamicFormService } from './dynamic-form.service';
import { DynamicFormControlBase } from './dynamic-form-control-base';

@Component({
    selector: 'k-dynamic-form-item',
    templateUrl: './dynamic-form-item.component.html',
    styleUrls : ['./dynamic-form-item.component.scss']
})
export class DynamicFormItem implements  OnInit {
    @Input() control: DynamicFormControlBase<any>;
    @Input() form : FormGroup;

    public isRequired: boolean;

    @ContentChildren(TemplateRef, {descendants: false}) public _templates: QueryList<TemplateRef<any>>;

    constructor(private _formBuilder : FormBuilder, private _dynamicFormService : DynamicFormService)
    {

    }

    ngOnInit() {
        this.isRequired=false;
        if(this.control.validators){
            const requeredValidator = this.control.validators
                .filter(validator => {
                    return validator == Validators.required;
                })[0] ;
            if(requeredValidator)
                this.isRequired=true;
        }
    }

    initItem(dynamicControl : DynamicFormControlBase<any>) {
        return this._dynamicFormService.toFormGroup([dynamicControl], { ignoreMultiple : true});
    }

    addItem(dynamicControl : DynamicFormControlBase<any>) {
        const control = <FormArray>this.form.controls[dynamicControl.key];
        control.push(this.initItem(dynamicControl));
        control.markAsDirty();
    }

    removeItem(dynamicControl : DynamicFormControlBase<any>, i: number) {
        const control = <FormArray>this.form.controls[dynamicControl.key];
        control.removeAt(i);
        control.markAsDirty();
    }
}
