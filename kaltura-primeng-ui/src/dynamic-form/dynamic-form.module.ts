import { NgModule } from '@angular/core';
import { PrimeControl } from './prime-control.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  InputTextModule, InputTextareaModule,  CalendarModule, MultiSelectModule,  DropdownModule, InputSwitchModule } from 'primeng/primeng';
import { PrimeListOptionsPipe } from './prime-list-options.pipe';

@NgModule(
    {
        imports : [
            ReactiveFormsModule,
            CommonModule,
            DropdownModule,
            MultiSelectModule,
            InputTextModule,
            InputTextareaModule,
            CalendarModule,
            InputSwitchModule

        ],
        declarations : [
            PrimeControl,
            PrimeListOptionsPipe
        ],
        exports : [
            PrimeControl
        ]
    }
)
export class DynamicFormModule
{

}