import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiSelect } from 'primeng/primeng';

/* tslint:disable */
export const KALTURA_MULTISELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiSelectComponent),
  multi: true
};

/* tslint:enable */

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
      transition('void => visible', animate('{{showTransitionParams}}')),
      transition('visible => void', animate('{{hideTransitionParams}}'))
    ])
  ],
  host: {
    '[class.ui-inputwrapper-filled]': 'filled',
    '[class.ui-inputwrapper-focus]': 'focus'
  },
  providers: [KALTURA_MULTISELECT_VALUE_ACCESSOR]
  /* tslint:enable */
})
export class MultiSelectComponent extends MultiSelect implements OnDestroy {
  @Input() disabledLabel: string;
  @Input() allSelectedLabel: string;
  @Input() selectAllLabel = 'Select All';
  @Input() menuItemDisplayStyle = 'block';
  @Input() hideOnScroll: string | Element;

  private _hideOnScrollListener: () => void;

  constructor(public el: ElementRef,
              public renderer: Renderer2,
              private _cd: ChangeDetectorRef) {
    super(el, renderer, _cd);
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

  public isPartiallyChecked(): boolean {
    return !this.isAllChecked() && (this.value || []).length > 0;
  }
}
