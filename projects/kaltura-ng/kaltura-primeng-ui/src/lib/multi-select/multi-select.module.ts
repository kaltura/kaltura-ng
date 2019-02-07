import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';
import { SharedModule } from 'primeng/components/common/shared';
import { MultiSelectComponent } from './multi-select.component';
import { MultiSelectModule as PrimeMultiSelectModule } from 'primeng/primeng';
import { MultiSelectItem } from './multi-select-item.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    PrimeMultiSelectModule,
    CommonModule,
    SharedModule,
    TooltipModule,
    ScrollingModule
  ],
  declarations: [MultiSelectComponent, MultiSelectItem],
  exports: [MultiSelectComponent],
})
export class MultiSelectModule {
}
