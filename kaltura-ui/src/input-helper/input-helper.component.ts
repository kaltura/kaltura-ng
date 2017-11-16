import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'kInputHelper',
    templateUrl: './input-helper.component.html',
    styleUrls: ['./input-helper.component.scss']
})
export class InputHelperComponent implements OnInit {
    @Input() title: string;
    @Input() icon: string = 'kIconhelp';
    @Input() width: number = 300;

    constructor() {
	    
    }

    ngOnInit() {}
}
