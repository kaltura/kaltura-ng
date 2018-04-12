import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';
import { SharedModule } from 'primeng/components/common/shared';
import { CalendarComponent } from './calendar.component';
import { CalendarModule as PrimeCalendarModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TooltipModule,
    PrimeCalendarModule
  ],
  declarations: [CalendarComponent],
  exports: [CalendarComponent],
  
})
export class CalendarModule {
}