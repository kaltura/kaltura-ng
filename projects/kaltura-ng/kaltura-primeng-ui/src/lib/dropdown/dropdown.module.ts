import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule as PrimeDropdownModule } from 'primeng/dropdown';
import { DropdownComponent } from './dropdown.component';

@NgModule(
  {
    imports: [
      CommonModule,
      PrimeDropdownModule
    ],
    declarations: [
      DropdownComponent
    ],
    exports: [
      DropdownComponent
    ],
    providers: []
  }
)
export class DropdownModule {

}
