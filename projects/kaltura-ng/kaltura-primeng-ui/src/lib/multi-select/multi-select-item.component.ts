import {Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'p-multiSelectItem',
  template: `
    <li class="p-multiselect-item" (click)="onOptionClick($event)" (keydown)="onOptionKeydown($event)" [attr.aria-label]="label"
        [attr.tabindex]="disabled ? null : '0'" [ngStyle]="{'height': itemSize + 'px'}"
        [ngClass]="{'p-highlight': selected, 'p-disabled': disabled}" pRipple>
      <div class="p-checkbox p-component">
        <div class="p-checkbox-box" [ngClass]="{'p-highlight': selected}">
          <span class="p-checkbox-icon" [ngClass]="{'pi pi-check': selected}"></span>
        </div>
      </div>
      <span *ngIf="!template">{{label}}</span>
      <ng-container *ngTemplateOutlet="template; context: {$implicit: option}"></ng-container>
    </li>
  `,
  encapsulation: ViewEncapsulation.None
})
export class MultiSelectItem {

  @Input() option: any;

  @Input() selected: boolean;

  @Input() label: any;

  @Input() disabled: boolean;

  @Input() itemSize: number;

  @Input() template: TemplateRef<any>;

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
