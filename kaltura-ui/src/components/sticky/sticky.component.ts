import { Component, ElementRef, Input, AfterViewInit, Renderer, ViewChild } from '@angular/core';

@Component({
	selector: 'kSticky',
	templateUrl: './sticky.component.html',
	styleUrls: ['./sticky.component.scss']
})
export class StickyComponent implements AfterViewInit {

	public wrapperHeight = 0;
	private elementRef: any;

	@Input('stickyClass') stickyClass: string;
	@Input('stickyTop') stickyTop: number = 0;
	@Input('stickyOffsetTop') stickyOffsetTop: number = 0;
	@Input('container') container: any;

	@ViewChild('contentWrapper') content: ElementRef;

	constructor() {}

	ngAfterViewInit(): void {
		this.UpdateLayout();
	}

	public UpdateLayout(){
		setTimeout(()=>{
			if (this.content.nativeElement.children.length > 0) {
				this.wrapperHeight = this.content.nativeElement.children[0].clientHeight;
			}else{
				console.warn("Sticky component::could not access content.");
			}
		},0);
	}

}

