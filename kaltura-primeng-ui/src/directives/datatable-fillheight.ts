import {
  AfterViewInit,
  ChangeDetectorRef,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy
} from '@angular/core';
import { DataTable } from 'primeng/primeng';

function isDataTable(x: DataTable): x is DataTable {
  return x ? !!x.onEdit : false;
}

@Directive({
  selector: '[kFillHeight]',
})
export class FillHeightDirective implements AfterViewInit, OnDestroy {
  @Input() set kFillHeight(value) {
    if (value !== '') { // default value is empty string
      this.fillHeightOn = value;
    }
  };

  @ContentChild('dataTable') public dataTable: DataTable;

  intervalID: any = null;
  currentHeight: number;
  fillHeightOn = true;

  constructor(private zone: NgZone, private el: ElementRef, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    if (!isDataTable(this.dataTable) || !this.fillHeightOn) {
      return;
    }
    const scrollBodyArr = this.dataTable.el.nativeElement.getElementsByClassName("ui-datatable-scrollable-body");
    const scrollHeaderArr = this.dataTable.el.nativeElement.getElementsByClassName("ui-datatable-scrollable-header");

    if (scrollBodyArr && scrollBodyArr.length > 0 && scrollHeaderArr && scrollHeaderArr.length > 0) {
      const scrollBody = scrollBodyArr[0];
      const scrollHeader = scrollHeaderArr[0];
      this.currentHeight = 0;
      this.zone.runOutsideAngular(() => {
        this.intervalID = setInterval(() => {
          if (this.el.nativeElement.clientHeight > this.currentHeight + 1 || this.el.nativeElement.clientHeight < this.currentHeight - 1) {
            this.currentHeight = this.el.nativeElement.clientHeight;
            if (scrollBody) {
              this.changeDetectorRef.markForCheck();
              scrollBody.style.maxHeight = (this.el.nativeElement.clientHeight - scrollHeader.clientHeight) + "px";
            }
          }
        }, 200);
      });
    }
  }

  ngOnDestroy() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }
}
