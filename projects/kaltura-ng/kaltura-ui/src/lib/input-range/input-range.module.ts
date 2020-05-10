import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputRangeComponent } from './input-range.component';
import { TooltipModule } from "../tooltip/k-tooltip.module";

@NgModule({
  imports: [
    CommonModule,
    TooltipModule
  ],
  declarations: [
    InputRangeComponent
  ],
  exports: [
    InputRangeComponent
  ],
  providers: [
  ]
})
export class InputRangeModule {}
