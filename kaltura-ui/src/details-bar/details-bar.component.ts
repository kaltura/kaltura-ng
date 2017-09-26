import { Output, EventEmitter, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { DetailInfoComponent } from './detail-info.component';




@Component({
  selector: 'k-details-bar',
  templateUrl: './details-bar.component.html',
  styleUrls: ['./details-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsBarComponent {

  @Input() data: any[] = [];
  @Input() captionField: string;
  @Input() valueField: string;
  @Input() iconStyleField: string;
  @Input() separatorField: string ="|";
  @Input() maxItemWidthField: number = 100;

  //@ViewChildren(DetailInfoComponent)
}

