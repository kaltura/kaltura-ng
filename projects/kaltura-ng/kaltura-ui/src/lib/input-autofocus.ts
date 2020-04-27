import { Directive, ElementRef, Renderer2, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[kAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  private _autofocus = true;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    if (this._autofocus) {
      setTimeout(() => {
        this.renderer.selectRootElement(this.el.nativeElement).focus();
      });
    }
  }

  @Input()
  set inputAutofocus(allowed: boolean) {
    this._autofocus = allowed;
  }
}
