import {Component, ContentChild, Input, TemplateRef} from '@angular/core';

@Component({
  selector: 'k-column',
  template: ''
})
export class ColumnComponent {
  @Input() field: string;
  @Input() style: string;
  @Input() header: string;
  @ContentChild(TemplateRef, { static: true }) template: TemplateRef<any>;
}
