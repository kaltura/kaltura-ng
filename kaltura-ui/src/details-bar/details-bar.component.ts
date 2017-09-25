import { Output, EventEmitter, Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DetailInfoComponent } from './detail-info.component';




@Component({
  selector: 'k-details-bar',
  templateUrl: './details-bar.component.html',
  styleUrls: ['./details-bar.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class DetailsBarComponent implements OnInit  {

  ngOnInit()
  {

  }
}

