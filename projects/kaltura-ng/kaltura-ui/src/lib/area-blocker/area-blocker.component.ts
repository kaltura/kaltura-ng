import { Component, Input, OnInit, ViewEncapsulation, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AreaBlockerMessage } from './area-blocker-message';

@Component({
  selector: 'k-area-blocker',
  templateUrl: './area-blocker.component.html',
  styleUrls: ['./area-blocker.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AreaBlockerComponent implements OnInit  {

  private _showLoader: boolean;
  public _message : AreaBlockerMessage;
  private _showLoaderHandler: number;

  @ViewChild('areaBlockerContainer', { static: true }) areaBlockerContainer: ElementRef;
  @ViewChild('spinnerContainer', { static: true }) spinnerContainer: ElementRef;

  @Input() bodyScroll : boolean = false;
  @Input() spinnerMarginTop : number = 0;
  @Input() classes : string;

  @Input() set showLoader(value : boolean) {
      // once showLoader is set to true, use a timeout so *ngIf will cause the HTML to render and then calculate area blocker width
      if (value) {
          this._showLoaderHandler = setTimeout(() => {
              this._showLoaderHandler = null;
              if (this.bodyScroll && !!this.areaBlockerContainer) {
                  const rect = this.areaBlockerContainer.nativeElement.getBoundingClientRect();
                  if (rect.width < document.body.clientWidth && this.spinnerContainer) {
                      this._renderer.setStyle(this.spinnerContainer.nativeElement, 'left', `${rect.left + rect.width / 2}px`);
                  }
              }
              this._renderer.setStyle(this.spinnerContainer.nativeElement, 'opacity', '1'); // show the spinner only after its position is calculated to prevent seeing it jumps...
          }, 0);
      } else {
          if (this._showLoaderHandler) {
              clearTimeout(this._showLoaderHandler);
              this._showLoaderHandler = null;
          }
          if (this.bodyScroll && this.spinnerContainer) {
              this._renderer.setStyle(this.spinnerContainer.nativeElement, 'opacity', '0'); // hide the spinner so we won't see it jump next time its position is recalculated
          }
      }
      this._showLoader = value;
  }

  get showLoader(): boolean{
    return this._showLoader;
  }

  @Input()
  set message(value : AreaBlockerMessage | string)
  {
    if (typeof value === 'string')
    {
      this._message = { title : 'Error', message : value, buttons : [{ label :'Dismiss', action : () => { this._message = null;}}]};
    }else if (value instanceof AreaBlockerMessage)
    {
      this._message = value;
    }else
    {
      this._message = null;
    }
  }

  constructor(private _renderer: Renderer2){}

  public handleAction(button : { action : () => void}) {
    if (button) {
      button.action();
    }
  }

  ngOnInit()
  {

  }

}

