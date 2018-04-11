import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { TagComponent } from './tag.component';
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'kTags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements AfterViewInit, OnDestroy {

	@Input() data: any[] = [];
	@Input() disabled: boolean = false;
    @Input() labelField: string;
	@Input() tooltipField: string;
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

  private _shouldEnableRightArrow(): boolean {
    const scrollPageWidth = this.scroller.nativeElement.getBoundingClientRect().width;
    const totalScroll = this.scroller.nativeElement.scrollWidth;
    
    return (this.scroller.nativeElement.scrollLeft + scrollPageWidth) < (totalScroll - 1)
  }
  
  private _shouldEnableLeftArrow(): boolean {
    return this.scroller.nativeElement.scrollLeft > 1;
  }
  
  public _updateArrows(): void {
    this._scrollLeftEnabled = this._shouldEnableLeftArrow();
    this._scrollRightEnabled = this._shouldEnableRightArrow();
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
				if (this._showMore) {
          this._updateArrows();
				}
			}
			this.showMoreCheckIntervalID = null;
		},100);
	}
  
  scroll(direction: string): void {
    const scrollPageWidth = this.scroller.nativeElement.getBoundingClientRect().width;
    const targetScrollLeft = direction === "right"
      ? this.scroller.nativeElement.scrollLeft + scrollPageWidth
      : this.scroller.nativeElement.scrollLeft - scrollPageWidth;
    this.scroller.nativeElement.scroll({ left: targetScrollLeft, behavior: 'smooth' });
  }
}
