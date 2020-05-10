import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClearableInputComponent } from './clearable-input.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule
  ],
  declarations: [ClearableInputComponent],
  exports: [ClearableInputComponent],

})
export class ClearableInputModule {
}
