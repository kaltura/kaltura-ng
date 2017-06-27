import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
    selector: 'kTag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss']
})
export class TagComponent{

	@Input() label: string;
	@Input() tooltip: string;
	@Input() data: any;
	@Input() showRemove: boolean = true;
	@Input() template: TemplateRef<any>;


    @Output() onRemoved = new EventEmitter<any>();

    constructor() {
    }

	removeTag(tag: any) {
		this.onRemoved.emit(tag);
    }

}
