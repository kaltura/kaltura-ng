import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/components/common/shared';
import { TimeSpinnerComponent } from "./time-spinner.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [TimeSpinnerComponent],
  exports: [TimeSpinnerComponent],
  
})
export class TimeSpinnerModule {
}