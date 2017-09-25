import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
    selector: 'kDetailInfo',
    templateUrl: './detail-info.component.html',
    styleUrls: ['./detail-info.component.scss']
})
export class DetailInfoComponent {

    @Input() caption?: string;
    @Input() value?: string;
    @Input() tooltip: string;
    @Input() toolTipAsHTML: boolean;
    @Input() iconStyle: string;
    @Input() itemStyle: string;
    @Input() separator: string;
    @Input() isLastItem: boolean;
    //     type* 
    @Input() data: any;
    @Input() template: TemplateRef<any>;

    constructor() {
    }
}
