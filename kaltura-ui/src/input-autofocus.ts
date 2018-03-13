import { Directive, ElementRef, Renderer, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[kAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  private _autofocus = true;

  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  ngAfterViewInit() {
    if (this._autofocus) {
      setTimeout(() => {
        this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
      });
    }
  }

  @Input()
  set inputAutofocus(allowed: boolean) {
    this._autofocus = allowed;
  }
}
