import { ChangeDetectorRef, Component, ElementRef, forwardRef, Input, Renderer2 } from '@angular/core';
import {trigger,state,style,transition,animate,AnimationEvent} from '@angular/animations';
import { DomHandler } from 'primeng/components/dom/domhandler';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiSelect } from 'primeng/primeng';
import { SelectItem } from 'primeng/api';
import { ObjectUtils } from 'primeng/components/utils/objectutils';

/* tslint:disable */
export const KALTURA_MULTISELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiSelectComponent),
  multi: true
};

/* tslint:enable */

export interface KalturaSelectItem extends SelectItem {
  disabled?: boolean;
}

@Component({
  selector: 'kMultiSelect',
  styleUrls: ['./multi-select.component.scss'],
  templateUrl: './multi-select.component.html',
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
      transition('void => visible', animate('225ms ease-out')),
      transition('visible => void', animate('195ms ease-in'))
    ])
  ],
  host: {
    '[class.ui-inputwrapper-filled]': 'filled',
    '[class.ui-inputwrapper-focus]': 'focus'
  },
  providers: [DomHandler, ObjectUtils, KALTURA_MULTISELECT_VALUE_ACCESSOR]
  /* tslint:enable */
})
export class MultiSelectComponent extends MultiSelect {
  @Input() disabledLabel: string;
  @Input() allSelectedLabel: string;
  @Input() selectAllLabel: string = 'Select All';
  @Input() menuItemDisplayStyle = 'block';
  @Input() hideOnScroll: string | Element;

  private _hideOnScrollListener: () => void;

  constructor(public el: ElementRef,
              public domHandler: DomHandler,
              public renderer: Renderer2,
              public objectUtils: ObjectUtils,
              private _cd: ChangeDetectorRef) {
    super(el, domHandler, renderer, objectUtils, _cd);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._removeHideOnScrollHandler();
  }

  private _addHideOnScrollHandler() {
    if (this.hideOnScroll) {
      const listenElement = typeof this.hideOnScroll === 'string'
        ? document.querySelector(this.hideOnScroll)
        : this.hideOnScroll;

      if (listenElement instanceof Element) {
        this._hideOnScrollListener = this.renderer.listen(listenElement, 'scroll', () => this.hide());
      }
    }
  }

  private _removeHideOnScrollHandler() {
    if (this.hideOnScroll && this._hideOnScrollListener) {
      this._hideOnScrollListener();
    }
  }

  public show(): void {
    super.show();
    this._addHideOnScrollHandler();
  }

  public hide(): void {
    super.hide();
    this._removeHideOnScrollHandler();
  }

  public writeValue(value: string[] | null): void {
    this.value = (value || []).filter(val => {
      const relevantOption = (this.options || []).filter(option => option && option.value == val)[0];
      return this.isEnabled(relevantOption);
    });
    this.updateLabel();
    this.updateFilledState();
    this._cd.markForCheck();
  }

  public isEnabled(option: KalturaSelectItem): boolean {
    return option && typeof option.disabled !== 'undefined' ? !option.disabled : true;
  }

  public isSelected(option: KalturaSelectItem): boolean {
    return this.findSelectionIndex(option.value) !== -1 && this.isEnabled(option);
  }

  public toggleAll(event: Event, checkbox: HTMLInputElement): void {
    if (checkbox.checked) {
      this.value = [];
    } else {
      const options = this.getVisibleOptions();
      if (options) {
        this.value = options
          .filter(option => this.isEnabled(option))
          .map(({ value }) => value);
      }
    }

    checkbox.checked = !checkbox.checked;
    this.onModelChange(this.value);
    this.onChange.emit({ originalEvent: event, value: this.value });
    this.updateLabel();
  }

  public get footerFacetWorkaround(): any {
    // NOTICE: workaround to allow AOT transpilation as for NG6
    return this.footerFacet;
  }
  public isPartiallyChecked(): boolean {
    return !this.isAllChecked() && (this.value || []).length > 0;
  }

  public isAllChecked(): boolean {
    return this.options ? (this.value || []).length === this.options.length : false;
  }
}
