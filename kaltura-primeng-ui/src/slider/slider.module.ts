import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';
import { SharedModule } from 'primeng/components/common/shared';
import { SliderComponent } from "./slider.component";
import { SliderModule as PrimeSliderModule } from 'primeng/primeng';

@NgModule({
  imports: [
    PrimeSliderModule,
    CommonModule,
    SharedModule,
    TooltipModule],
  declarations: [SliderComponent],
  exports: [SliderComponent],
  
})
export class SliderModule {
}