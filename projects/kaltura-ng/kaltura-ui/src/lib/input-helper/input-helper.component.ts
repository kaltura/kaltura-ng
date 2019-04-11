import { Component, Input, OnInit } from '@angular/core';
import { PopupWidgetXPositions, PopupWidgetYPositions } from '../popup-widget/popup-widget.component';

@Component({
    selector: 'kInputHelper',
    templateUrl: './input-helper.component.html',
    styleUrls: ['./input-helper.component.scss']
})
export class InputHelperComponent implements OnInit {
    @Input() title: string;
    @Input() trigger: 'click' | 'hover' = 'hover';
    @Input() triggerIcon = 'kIconhelp_full';
    @Input() icon: string = 'kIconhelp';
    @Input() width: number = 300;
    @Input() placement: {x: PopupWidgetXPositions, y: PopupWidgetYPositions} = {x: 'right', y: 'top'};

    constructor() {}

    ngOnInit() {}
}
