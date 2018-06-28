import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/components/common/shared';
import { ClearableInputComponent } from "./clearable-input.component";
import { InputTextModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InputTextModule,
    FormsModule
  ],
  declarations: [ClearableInputComponent],
  exports: [ClearableInputComponent],
  
})
export class ClearableInputModule {
}