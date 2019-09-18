import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'p-multiSelectItem',
  template: `
    <li class="ui-multiselect-item ui-corner-all" (click)="onOptionClick($event)" (keydown)="onOptionKeydown($event)"
        [attr.aria-label]="option.label"
        [style.display]="visible ? 'block' : 'none'" [attr.tabindex]="option.disabled ? null : '0'" [ngStyle]="{'height': itemSize + 'px'}"
        [ngClass]="{'ui-state-highlight': selected, 'ui-state-disabled': (option.disabled || (maxSelectionLimitReached && !selected))}">
      <div class="ui-chkbox ui-widget">
        <div class="ui-chkbox-box ui-widget ui-corner-all ui-state-default"
             [ngClass]="{'ui-state-active': selected}">
          <span class="ui-chkbox-icon ui-clickable" [ngClass]="{'pi pi-check': selected}"></span>
        </div>
      </div>
      <label *ngIf="!template">{{option.label}}</label>
      <ng-container *ngTemplateOutlet="template; context: {$implicit: option}"></ng-container>
    </li>
  `
})
export class MultiSelectItem {
  
  @Input() option: SelectItem;
  
  @Input() selected: boolean;
  
  @Input() disabled: boolean;
  
  @Input() visible: boolean;
  
  @Input() itemSize: number;
  
  @Input() template: TemplateRef<any>;
  
  @Input() maxSelectionLimitReached: boolean;
  
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  
  @Output() onKeydown: EventEmitter<any> = new EventEmitter();
  
  onOptionClick(event: Event) {
    this.onClick.emit({
      originalEvent: event,
      option: this.option
    });
  }
  
  onOptionKeydown(event: Event) {
    this.onKeydown.emit({
      originalEvent: event,
      option: this.option
    });
  }
}
