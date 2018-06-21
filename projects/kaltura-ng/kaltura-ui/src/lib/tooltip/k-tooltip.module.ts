import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KTooltipDirective } from './k-tooltip.directive';

@NgModule(
  {
    imports: <any[]>[
      CommonModule
    ],
    declarations: <any[]>[
      KTooltipDirective
    ],
    exports: <any[]>[
      KTooltipDirective
    ]
  }
)
export class TooltipModule {

}
