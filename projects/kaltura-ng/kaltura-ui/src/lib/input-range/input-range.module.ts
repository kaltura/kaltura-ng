import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputRangeComponent } from './input-range.component';
import { TooltipModule } from "../tooltip/k-tooltip.module";

@NgModule({
  imports: <any[]>[
    CommonModule,
    TooltipModule
  ],
  declarations: <any[]>[
    InputRangeComponent
  ],
  exports: <any[]>[
    InputRangeComponent
  ],
  providers: <any[]>[
  ]
})
export class InputRangeModule {}
