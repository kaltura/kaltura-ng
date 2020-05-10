import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';
import { MultiSelectComponent } from './multi-select.component';
import { MultiSelectModule as PrimeMultiSelectModule } from 'primeng/multiselect';
import { MultiSelectItem } from './multi-select-item.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    PrimeMultiSelectModule,
    CommonModule,
    TooltipModule,
    ScrollingModule
  ],
  declarations: [MultiSelectComponent, MultiSelectItem],
  exports: [MultiSelectComponent],
})
export class MultiSelectModule {
}
