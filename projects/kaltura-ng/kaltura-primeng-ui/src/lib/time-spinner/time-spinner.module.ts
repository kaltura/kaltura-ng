import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSpinnerComponent } from "./time-spinner.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TimeSpinnerComponent],
  exports: [TimeSpinnerComponent],

})
export class TimeSpinnerModule {
}
