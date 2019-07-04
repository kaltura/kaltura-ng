import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Dropdown } from 'primeng/components/dropdown/dropdown';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectItem } from 'primeng/components/common/selectitem';

export const DROPDOWN_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DropdownComponent),
  multi: true
};


@Component({
  selector: 'kDropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss'],
  animations: [
    trigger('panelState', [
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
    '[class.ui-inputwrapper-focus]': 'focused'
  },
  providers: [DROPDOWN_VALUE_ACCESSOR]
})

export class DropdownComponent extends Dropdown {
  public onItemClick(event): void {
    const option = event.option;
    if (!option['disabled']) {
      super.onItemClick(event);
    } else {
      event.stopPropagation();
    }
  }

  public selectItem(event: MouseEvent, option: SelectItem): void {
    if (!option['disabled']) {
      super.selectItem(event, option);
    } else {
      event.stopPropagation();
    }
  }
}
