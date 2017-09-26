import { Component, EventEmitter, Input, Output, TemplateRef, OnInit } from '@angular/core';

@Component({
    selector: 'kDetailInfo',
    templateUrl: './detail-info.component.html',
    styleUrls: ['./detail-info.component.scss']
})
export class DetailInfoComponent implements OnInit {

    @Input() caption?: string;
    @Input() value?: string;
    @Input() tooltip: string;
    @Input() toolTipAsHTML: boolean;
    @Input() iconStyle: string;
    @Input() itemStyle: string;
    @Input() separator: string;
    @Input() maxItemWidth: number;
    @Input() isLastItem: boolean;
    //     type* 
    @Input() data: any;
    @Input() template: TemplateRef<any>;

    _info: string = "";

    constructor() {
    }
    ngOnInit() {
        if (this.caption) {
            this._info = this.caption;
        }
        if (this._info && this._info.length > 0 && this.value && this.value.length > 0) {
            this._info = this._info + ": " + this.value;
        }

        if ((!this._info || this._info.length === 0) && this.value && this.value.length > 0) {
            this._info = this.value;
        }

        if (!this.isLastItem && this._info && this._info.length > 0) {
            this._info = this._info + " "+ this.separator;
        }
    }
}
