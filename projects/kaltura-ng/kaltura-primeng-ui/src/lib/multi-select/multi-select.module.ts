import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';
import { SharedModule } from 'primeng/components/common/shared';
import { MultiSelectComponent } from './multi-select.component';
import { MultiSelectModule as PrimeMultiSelectModule } from 'primeng/primeng';
import { MultiSelectItem } from './multi-select-item.component';

@NgModule({
  imports: [
    PrimeMultiSelectModule,
    CommonModule,
    SharedModule,
    TooltipModule
  ],
  declarations: [MultiSelectComponent, MultiSelectItem],
  exports: [MultiSelectComponent],
})
export class MultiSelectModule {
}
