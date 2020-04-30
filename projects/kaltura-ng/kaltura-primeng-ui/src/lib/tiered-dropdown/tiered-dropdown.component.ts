import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef
} from '@angular/core';
import {TieredMenu} from 'primeng/tieredmenu';
import {MenuItem, SelectItem} from 'primeng/api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {PrimeTemplate} from 'primeng/api';
import {animate, state, style, transition, trigger} from '@angular/animations';

interface TieredMenuItem extends MenuItem {
  value?: any;
  items?: TieredMenuItem[];
}

export const TIERED_DROPDOWN_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TieredDropdownComponent),
  multi: true
};

@Component({
  selector: 'kTieredDropdown',
  templateUrl: 'tiered-dropdown.component.html',
  styleUrls: ['tiered-dropdown.component.scss'],
  animations: [
    trigger('overlayAnimation', [
      state('void', style({
        transform: 'translateY(5%)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => visible', animate('{{showTransitionParams}}')),
      transition('visible => void', animate('{{hideTransitionParams}}'))
    ])
  ],
  providers: [TIERED_DROPDOWN_VALUE_ACCESSOR]
})

export class TieredDropdownComponent extends TieredMenu implements ControlValueAccessor, AfterContentInit, OnInit {
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  @Input() placeholder;

  @Input() set items(value: Array<SelectItem | { label: string, icon: string, items: Array<SelectItem> }>) {
    this.menuItems = [];
    this.allOptions = value;
    value.forEach((item, index) => {
      if (item['items']) {
        const castedItem = item as { label: string, items: Array<SelectItem>, icon: string };
        this.menuItems.push({
          label: castedItem.label,
          icon: castedItem.icon,
          items: [...castedItem.items.map(i => this.selectItemToMenuItem(i))]
        });
      } else {
        const menuItem = this.selectItemToMenuItem(item as SelectItem);

        this.menuItems.push(menuItem);
      }
    });

  }

  @ContentChildren(PrimeTemplate) templates: QueryList<any>;

  itemTemplate: TemplateRef<any>;
  selectedItemTemplate: TemplateRef<any>;
  selectedMenuItemOption: MenuItem;
  option: SelectItem;
  menuItems: TieredMenuItem[] = [];
  parentActive: boolean;
  value: any;
  private allOptions: Array<SelectItem | { label: string, icon: string, items: Array<SelectItem> }> = [];


  onModelChange: Function = () => {
  };

  onModelTouched: Function = () => {
  };


  ngOnInit() {
    if (!this.placeholder && !this.selectedMenuItemOption && !this.option) {
      if (this.allOptions[0]['items']) {
        this.option = this.allOptions['items'][0] as SelectItem;
      } else {
        this.option = this.allOptions[0] as SelectItem;
      }

      this.selectedMenuItemOption = this.menuItems[0];
    }
  }

  ngAfterContentInit() {
    this.popup = true;
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'item':
          this.itemTemplate = item.template;
          break;
        case 'selectedItem':
          this.selectedItemTemplate = item.template;
          break;
        default:
          this.itemTemplate = item.template;
          break;
      }
    });
  }


  private selectItemToMenuItem(item: SelectItem): TieredMenuItem {
    return {
      label: item.label,
      icon: item.icon,
      disabled: item.disabled || false,
      styleClass: item.styleClass,
      value: item.value,
      command: (event) => {
        this.selectItem(item, event);

      }
    };
  }

  selectItem(item: SelectItem, event) {
    this.writeValue(item.value);
    this.onModelChange(this.value);
    this.onChange.emit(this.value);
  }

  writeValue(value: any): void {
    this.value = value;
    const menuItem = this.findMenuItem(this.menuItems, value);
    if (menuItem) {
      this.selectedMenuItemOption = menuItem;
      this.option = this.findMenuItem(this.allOptions, value);
    }

  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  show(event) {
    this.target = event.currentTarget;
    this.visible = true;
    this.parentActive = true;
    this.preventDocumentDefault = true;
  }

  hide() {
    this.visible = false;
    this.parentActive = false;
  }

  findMenuItem(items: TieredMenuItem[], value: any) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].items) {
        const found = this.findMenuItem(items[i].items, value);
        if (found) {
          return found;
        }
      } else {
        if (items[i].value === value) {
          return items[i];
        }
      }
    }
  }
}
