import { animate, Component, forwardRef, state, style, transition, trigger } from '@angular/core';
import { DomHandler } from 'primeng/components/dom/domhandler';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Calendar } from 'primeng/primeng';
import { ObjectUtils } from 'primeng/components/utils/objectutils';

/* tslint:disable */
export const KALTURA_MULTISELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarComponent),
  multi: true
};

/* tslint:enable */

@Component({
  selector: 'kCalendar',
  styleUrls: ['./calendar.component.scss'],
  templateUrl: './calendar.component.html',
  animations: [
    trigger('overlayState', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out'))
    ])
  ],
  host: {
    '[class.ui-inputwrapper-filled]': 'filled',
    '[class.ui-inputwrapper-focus]': 'focus'
  },
  providers: [DomHandler, ObjectUtils, KALTURA_MULTISELECT_VALUE_ACCESSOR]
  /* tslint:enable */
})
export class CalendarComponent extends Calendar {
  public hideOverlay(): void {
    this.overlayVisible = false;
    this.overlayShown = false;
  }
}
