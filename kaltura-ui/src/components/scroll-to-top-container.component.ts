import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'kScrollToTopContainer',
  template: '<ng-content></ng-content>',
  styles: [':host { display: block }']
})
export class ScrollToTopContainerComponent {
  constructor(private _el: ElementRef) {
  }

  public scrollToTop(): void {
    this._el.nativeElement.scrollTop = 0;
  }
}

