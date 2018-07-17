import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  HostListener,
  ElementRef,
  ContentChildren,
  TemplateRef, SimpleChanges, OnChanges,
} from '@angular/core';
import { TagComponent } from './tag.component';
import { Subscription } from "rxjs/Subscription";

import * as $NS from 'jquery';
const $ = $NS;

@Component({
    selector: 'kTags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() data: any[];
  @Input() disabled: boolean = false;
  @Input() labelField: string;
	@Input() tooltipField: string;
	@Input() disabledField: string;
	@Input() removableTags: boolean = true;
	@Input() showClear: boolean = true;
	@Input() title: string;
	@Input() clearAllLabel: string = "Clear All";

	@ContentChildren(TemplateRef, {descendants: false}) public templates: QueryList<TemplateRef<any>>;

    @Output() onTagRemove = new EventEmitter<any>();
    @Output() onRemoveAll = new EventEmitter<any>();
	@Output() onTagsChange = new EventEmitter<{tagsCount: number}>();

	@ViewChild('scroller') scroller: ElementRef;

	@ViewChildren(TagComponent)
	private tagsList: QueryList<any>
	private tagsListObserver: Subscription;
  
	public _showMore: boolean = false;
	private showMoreCheckIntervalID: number;
	public _scrollLeftEnabled: boolean = false;
	public _scrollRightEnabled: boolean = true;

    constructor() {
    }

	@HostListener("window:resize", [])
	onWindowResize() {
		this.checkShowMore();
	}

  ngOnChanges(changes: SimpleChanges) {
      if (changes['data']) {
        if (this.disabledField && Array.isArray(this.data)) {
            this.data.sort((a, b) => Number(b[this.disabledField] || 0) - Number(a[this.disabledField] || 0));
        }

        this.checkShowMore();
      }
  }

	ngAfterViewInit(){
		this.tagsListObserver = this.tagsList.changes.subscribe((comps: QueryList <any>) =>
		{
			this.onTagsChange.emit({tagsCount: (this.data ? this.data.length : 0) });
			this.checkShowMore();
		});
	}

	ngOnDestroy(){
		if (this.tagsListObserver){
			this.tagsListObserver.unsubscribe();
			this.tagsListObserver = null;
		}
	}

    removeTag(tag: any){
    	this.onTagRemove.emit(tag);
    }

    clearAll(){
    	this.onRemoveAll.emit();
    }

	checkShowMore(){
		// we use a cancelable interval to improve performances on window resize
		if (this.showMoreCheckIntervalID){
			clearInterval(this.showMoreCheckIntervalID);
			this.showMoreCheckIntervalID = null;
		}
		this.showMoreCheckIntervalID = setTimeout(() => {
			if (this.data && this.data.length && this.scroller){
				this._showMore = this.scroller.nativeElement.scrollWidth > (this.scroller.nativeElement.getBoundingClientRect().width + 1);
			}
			this.showMoreCheckIntervalID = null;
		},100);
	}

	scroll(direction: string){
		const scrollPageWidth = this.scroller.nativeElement.getBoundingClientRect().width;
		const totalScroll = this.scroller.nativeElement.scrollWidth;
		if (direction === "right"){
			const targetScrollLeft = this.scroller.nativeElement.scrollLeft + scrollPageWidth;
			$(this.scroller.nativeElement).animate({scrollLeft: targetScrollLeft}, 800, () => {
				this._scrollLeftEnabled = true;
				if ((this.scroller.nativeElement.scrollLeft + scrollPageWidth) >= (totalScroll-1)){
					this._scrollRightEnabled = false;
				}
			});
		}else{
			const targetScrollLeft = this.scroller.nativeElement.scrollLeft - scrollPageWidth;
			$(this.scroller.nativeElement).animate({scrollLeft: targetScrollLeft}, 800, () => {
				this._scrollRightEnabled = true;
				if (this.scroller.nativeElement.scrollLeft <= 1){
					this._scrollLeftEnabled = false;
				}
			});

		}
	}
}
