import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
  selector: 'p-multiSelectItem',
  template: `
    <li class="p-multiselect-item" (click)="onOptionClick($event)" (keydown)="onOptionKeydown($event)" [attr.aria-label]="option.label"
        [attr.tabindex]="option.disabled ? null : '0'" [ngStyle]="{'height': itemSize + 'px'}" [style.display]="visible ? 'block' : 'none'"
        [ngClass]="{'p-highlight': selected, 'p-disabled': (option.disabled || (maxSelectionLimitReached && !selected))}">
      <div class="p-checkbox p-component">
        <div class="p-checkbox-box" [ngClass]="{'p-highlight': selected}">
          <span class="p-checkbox-icon" [ngClass]="{'pi pi-check': selected}"></span>
        </div>
      </div>
      <span *ngIf="!template">{{option.label}}</span>
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
