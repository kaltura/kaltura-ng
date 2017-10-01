import { DetailInfo } from './details-bar.component';
import { Component, EventEmitter, Input, Output, TemplateRef, OnInit } from '@angular/core';

@Component({
    selector: 'kDetailInfo',
    templateUrl: './detail-info.component.html',
    styleUrls: ['./detail-info.component.scss']
})
export class DetailInfoComponent implements OnInit {

    @Input() caption?: string;
    @Input() value?: string;
    @Input() link?: string;
    @Input() tooltip: string;
    @Input() toolTipAsHTML: boolean;
    @Input() iconStyle: string;
    @Input() itemStyle: string;
    @Input() separator: string;
    @Input() maxItemWidth: number;
    @Input() isLastItem: boolean;
    //     type* 
    @Input() data: DetailInfo;
    @Input() template: TemplateRef<any>;

    constructor() {
    }
    ngOnInit() {
        if (this.link && this.link.length > 0 && !this.value) {
            this.value = this.link;
        }
    }
}
