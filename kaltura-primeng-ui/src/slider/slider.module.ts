import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';
import { SharedModule } from 'primeng/components/common/shared';
import { SliderComponent } from "./slider.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TooltipModule],
  declarations: [SliderComponent],
  exports: [SliderComponent],
  
})
export class SliderModule {
}