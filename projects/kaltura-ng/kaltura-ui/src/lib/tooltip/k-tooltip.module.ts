import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KTooltipDirective } from './k-tooltip.directive';

@NgModule(
  {
    imports: [
      CommonModule
    ],
    declarations: [
      KTooltipDirective
    ],
    exports: [
      KTooltipDirective
    ]
  }
)
export class TooltipModule {

}
