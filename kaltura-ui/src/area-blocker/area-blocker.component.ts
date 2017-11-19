import { Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { AreaBlockerMessage } from './area-blocker-message';




@Component({
  selector: 'k-area-blocker',
  templateUrl: './area-blocker.component.html',
  styleUrls: ['./area-blocker.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AreaBlockerComponent implements OnInit  {

  public _message : AreaBlockerMessage;

  private _showLoader: boolean;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @Input() centerOnScreen : boolean = false;
  @Input() spinnerMarginTop : number = 0;
  @Input() classes : string;

  @Input()
  set message(value : AreaBlockerMessage | string)
  {
    if (typeof value === 'string') {
      this._message = this.stringToMessage(value);
      this.renderer.addClass(this.elementRef.nativeElement, "kVisible");
    } else if (value instanceof AreaBlockerMessage) {
      this.renderer.addClass(this.elementRef.nativeElement, "kVisible");
      this._message = value;
    } else {
        this.renderer.removeClass(this.elementRef.nativeElement, "kVisible");
      this._message = null;
    }
  }
  @Input()
  set showLoader(value: boolean) {
      this._showLoader = value;
      if (value) {
          this.renderer.addClass(this.elementRef.nativeElement, 'kLoading');
          return;
      }
      this.renderer.removeClass(this.elementRef.nativeElement, 'kLoading');
  }
  get showLoader() {
      return this._showLoader;
  }

  private stringToMessage = (value : string) => new AreaBlockerMessage({
      title : 'Error',
      message : value,
      buttons : [
          {
            label :'Dismiss',
            action : () => this._message = null
          }
      ]
  });

  public handleAction(button : { action : () => void}) {
    if (button) {
      button.action();
    }
  }

  ngOnInit()
  {

  }

}

