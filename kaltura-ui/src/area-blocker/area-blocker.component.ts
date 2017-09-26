import { Output, EventEmitter, Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AreaBlockerMessage } from './area-blocker-message';




@Component({
  selector: 'k-area-blocker',
  templateUrl: './area-blocker.component.html',
  styleUrls: ['./area-blocker.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AreaBlockerComponent implements OnInit  {

  public _message : AreaBlockerMessage;

  @Input() showLoader : boolean;

  @Input()
  set message(value : AreaBlockerMessage | string)
  {
    if (typeof value === 'string')
    {
      this._message = { title : 'Uh oh!', message : value, buttons : [{ label :'Dismiss', action : () => { this._message = null;}}]};
    }else if (value instanceof AreaBlockerMessage)
    {
      this._message = value;
    }else
    {
      this._message = null;
    }
  }

  public handleAction(button : { action : () => void}) {
    if (button) {
      button.action();
    }
  }

  ngOnInit()
  {

  }
}

