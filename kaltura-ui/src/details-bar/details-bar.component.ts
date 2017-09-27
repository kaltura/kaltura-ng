import { Output, EventEmitter, Component, ElementRef, Input, ViewEncapsulation, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { DetailInfoComponent } from './detail-info.component';




@Component({
  selector: 'k-details-bar',
  templateUrl: './details-bar.component.html',
  styleUrls: ['./details-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsBarComponent implements AfterViewInit {

  @Input() data: any[] = [];
  @Input() captionField: string;
  @Input() valueField: string;
  @Input() iconStyleField: string;
  @Input() separatorField: string = "|";
  @Input() maxItemWidthField: number = 100;

  @ViewChild('dataPanel') dataPanel: ElementRef;
  @ViewChild('dataWrapper') dataWrapper: ElementRef;
  public _showMore: boolean = false;
  private showMoreCheckIntervalID: number;
  public _showLessEnabled: boolean = false;
  public _showMoreEnabled: boolean = true;

  public text: string;

  ngAfterViewInit() {
    this.checkShowMore();
  }

  @HostListener('window:resize')
  private onResize() {
    this.checkShowMore();
  }

  checkShowMore() {
    // we use a cancelable interval to improve performances on window resize
    if (this.showMoreCheckIntervalID) {
      clearInterval(this.showMoreCheckIntervalID);
      this.showMoreCheckIntervalID = null;
    }
    this.showMoreCheckIntervalID = setTimeout(() => {
      if (this.data && this.data.length && this.dataPanel) {
        this._showMore = this.dataWrapper.nativeElement.clientHeight < (this.dataPanel.nativeElement.getBoundingClientRect().height);
      }
      else
        this._showMore = false;
      this.showMoreCheckIntervalID = null;
    }, 100);
  }

  show(direction: string) {
    if (direction === "more") {
      this.dataPanel.nativeElement.style.marginTop = this.dataPanel.nativeElement.children[0].clientHeight * (-1) + "px";
      this._showLessEnabled = true;
      this._showMoreEnabled = false;
    }
    else {
      this.dataPanel.nativeElement.style.marginTop = "0px";
      this._showLessEnabled = false;
      this._showMoreEnabled = true;
    }
  }
}

