import {ChangeDetectorRef, Component, EventEmitter, forwardRef, Inject, Input, Output, Renderer2, TemplateRef} from '@angular/core';
import {TieredMenu, TieredMenuSub} from 'primeng/tieredmenu';
import {MenuItem} from 'primeng/api';
import {TieredDropdownComponent} from '../tiered-dropdown.component';

@Component({
  selector: 'kTieredDropdownSub',
  templateUrl: 'tiered-dropdown-sub.component.html',
  styleUrls: ['tiered-dropdown-sub.component.scss'],
  providers: [TieredMenu]
})
export class TieredDropdownSubComponent extends TieredMenuSub {

  @Input() template: TemplateRef<any>;
  @Input() item: MenuItem;
  @Input() root: boolean;
  @Input() selectedItem: MenuItem;

  @Input() get parentActive(): boolean {
    return this._parentActive;
  }

  set parentActive(value) {
    this._parentActive = value;

    if (!value) {
      this.activeItem = null;
    }
  }

  _parentActive: boolean;
  _isItemSelected: boolean;

  selectItem(event, item) {
    super.itemClick(event, item);
  }
}
