import { Component, forwardRef, Input } from '@angular/core';
import { DomHandler } from 'primeng/components/dom/domhandler';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Slider } from 'primeng/slider';

/* tslint:disable */
export const KALTURA_SLIDER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SliderComponent),
  multi: true
};

/* tslint:enable */

@Component({
  selector: 'kSlider',
  styleUrls: ['./slider.component.scss'],
  templateUrl: './slider.component.html',
  providers: [DomHandler, KALTURA_SLIDER_VALUE_ACCESSOR]
  /* tslint:enable */
})
// [kmcng] upon upgrade: compare implemented interfaces in the original component (no need to include ControlValueAccessor)
export class SliderComponent extends Slider {
  @Input() tooltip = true;
}
