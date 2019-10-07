import { NgModule } from '@angular/core';
import { PrimeControl } from './prime-control.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrimeListOptionsPipe } from './prime-list-options.pipe';
import { MultiSelectModule } from '../multi-select/multi-select.module';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';

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
