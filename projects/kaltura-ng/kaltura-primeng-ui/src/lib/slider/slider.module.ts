import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';
import { SliderComponent } from './slider.component';
import { SliderModule as PrimeSliderModule } from 'primeng/slider';

@NgModule({
  imports: [
    PrimeSliderModule,
    CommonModule,
    TooltipModule],
  declarations: [SliderComponent],
  exports: [SliderComponent],

})
export class SliderModule {
}
