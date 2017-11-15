import { NgModule } from '@angular/core';
import { DynamicFormService } from './dynamic-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicFormItem } from './dynamic-form-item.component';
import {TooltipModule} from "../tooltip/k-tooltip.module";

@NgModule(
    {
        imports : [
            ReactiveFormsModule,
            CommonModule,
            TooltipModule
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