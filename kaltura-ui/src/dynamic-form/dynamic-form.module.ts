import { NgModule } from '@angular/core';
import { DynamicFormService } from './dynamic-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicFormItem } from './dynamic-form-item.component';

@NgModule(
    {
        imports : [
            ReactiveFormsModule,
            CommonModule
        ],
        declarations : [
            DynamicFormItem
        ],
        exports : [
            DynamicFormItem
        ],
        providers : [
            DynamicFormService
        ]
    }
)
export class DynamicFormModule
{

}