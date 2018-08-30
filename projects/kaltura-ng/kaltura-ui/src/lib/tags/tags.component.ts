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
  @Input() layout: 'arrows' | 'button' = 'arrows';
  @Input() rowsVisible = 2;
  @Input() showLessLabel = 'Show less';
  
  @ContentChildren(TemplateRef, {descendants: false}) public templates: QueryList<TemplateRef<any>>;
  
  @Output() onTagRemove = new EventEmitter<any>();
  @Output() onRemoveAll = new EventEmitter<any>();
  @Output() onTagsChange = new EventEmitter<{tagsCount: number}>();
  
  @ViewChild('scroller') scroller: ElementRef;
  @ViewChild('tagsWrapper') tagsWrapper: ElementRef;
  
  @ViewChildren(TagComponent)
  private tagsList: QueryList<any>
  private tagsListObserver: Subscription;
  
  public _showMore: boolean = false;
  private showMoreCheckIntervalID: number;
  private _calculateRowsCheckIntervalID: number;
  public _scrollLeftEnabled: boolean = false;
  public _scrollRightEnabled: boolean = true;
  
  public _visibleTags = [];
  public _hiddenCount: number;
  
  constructor() {
  
  }
  
  @HostListener("window:resize", [])
  onWindowResize() {
    if (this.layout === 'button') {
      this._calculateRows();
    } else {
      this.checkShowMore();
    }
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.disabledField && Array.isArray(this.data)) {
        this.data.sort((a, b) => Number(b[this.disabledField] || 0) - Number(a[this.disabledField] || 0));
      }
      
      this._visibleTags = this.data || [];
      
      if (this.layout === 'button') {
        this._calculateRows();
      } else {
        this.checkShowMore();
      }
    }
  }
  
  ngAfterViewInit(){
    this.tagsListObserver = this.tagsList.changes.subscribe((comps: QueryList <any>) =>
    {
      this.onTagsChange.emit({tagsCount: (this.data ? this.data.length : 0) });
      if (this.layout === 'arrows') {
        this.checkShowMore();
      }
    });
  }
  
  ngOnDestroy(){
    if (this.tagsListObserver){
      this.tagsListObserver.unsubscribe();
      this.tagsListObserver = null;
    }
  }
  
  removeTag(tag: any) {
    this.onTagRemove.emit(tag);
  }
  
  clearAll(){
    this.onRemoveAll.emit();
  }
  
  public _calculateRows(): void {
    if (this._calculateRowsCheckIntervalID) {
      clearInterval(this.showMoreCheckIntervalID);
      this._calculateRowsCheckIntervalID = null;
    }
    
    this._calculateRowsCheckIntervalID = setTimeout(() => {
      const threshold = 80; // size of show less button
      const rowWidth = this.scroller.nativeElement.getBoundingClientRect().width;
      const tagsWrapper = this.tagsWrapper.nativeElement as HTMLElement;
      const tagElements = Array.from(tagsWrapper.children);
      const visibleTags = [];
      const hiddenTags = [];
      let visibleTagsLength = 0;
      
      tagElements.forEach((tagEl: HTMLElement, index: number) => {
        visibleTagsLength += tagEl.offsetWidth;
        
        if (visibleTagsLength <= rowWidth * this.rowsVisible - threshold) {
          visibleTags.push(this.data[index]);
        } else {
          hiddenTags.push(this.data[index]);
        }
      });
      
      this._visibleTags = visibleTags;
      this._hiddenCount = hiddenTags.length > 0 ? hiddenTags.length : null;
      
      this._calculateRowsCheckIntervalID = null;
    }, 100);
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
  
  public _showAll(): void {
    this._visibleTags = this.data;
    this._hiddenCount = 0;
  }
}
