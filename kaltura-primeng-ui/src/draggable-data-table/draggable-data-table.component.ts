import {
    AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, Input, OnInit, Output,
    QueryList, Renderer2, TemplateRef, ViewChild
} from '@angular/core';
import {ColumnComponent} from './column.component';
import {Subscription} from 'rxjs/Subscription';
import "rxjs/add/operator/delay";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';

const sortingFunction = (a, b) => {
    if (a === b)
        return 0;
    else if (a < b)
        return -1;
    else
        return 1;
};

const Events = {
    MOUSE_UP: 'mouseup',
    MOUSE_MOVE: 'mousemove',
    MOUSE_DOWN: 'mousedown',
    MOUSE_OVER: 'mouseover',
    MOUSE_ENTER: 'mouseenter',
    MOUSE_LEAVE: 'mouseleave'
};

@Component({
    selector: 'k-draggable-data-table',
    templateUrl: './draggable-data-table.component.html',
    styleUrls: ['./draggable-data-table.component.scss']
})
export class DraggableDataTableComponent implements AfterContentInit, OnInit {

    @Input() emptyStateTemplate: TemplateRef<any>;

    @Input() draggableViewTemplate: TemplateRef<any>;

    @Output() valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    @ViewChild('draggable') private draggableElement: ElementRef;

    @ViewChild('tableBody') private tableBody: ElementRef;

    @ContentChildren(ColumnComponent) cols: QueryList<ColumnComponent>;

    currentDraggableItem: any;

    draggable: any;

    tableBodyElement: any;

    columns: ColumnComponent[];

    dragModeOff: boolean = true;

    selectedIndexes: number[] = [];

    mouseMoveSubscription: Subscription;

    mouseMove: Observable<any>;

    private _value: any[];

    public draggableItems: any[];

    public unDraggableItemsFromTop: any[];

    public unDraggableItemsFromBottom: any[];

    private _currentDraggedIndex: number;

    private _currentPlaceHolderIndex: number = -1;

    private _currentDraggedElement: EventTarget;

    private _dropAvailable = false;

    @Input() set value(val: any[]) {
        if (val) {
            this._value = [...val];
            this._orderItems();
        } else {
            this._value = null;
        }
    }

    get value(): any[] {
        if (this.dragModeOff) {
            return this._value;
        }
    }


    @Input() unDraggableFromTop = 0;

    @Input() unDraggableFromBottom = 0;

    @Input() rowTrackBy: Function = (index: number, item: any) => item;

    @Input() columnTrackBy: Function = (index: number, item: any) => item;

    @Input() paginator: boolean = false;

    @Input() rows: number;

    @Input() rowsPerPageOptions: number[];

    @Input() showIndex: boolean = false;

    @Input() multipleDragAndDrop: boolean = false;

    @Input() selectable: boolean = false;

    @Output() selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    @Output() pageChange: EventEmitter<any> = new EventEmitter<any>();


    constructor(private renderer: Renderer2) {
    }

    // component lifecycle events
    ngOnInit(): void {
        if(this.paginator) {
            this.unDraggableFromBottom = this.rows;
        }

        this._orderItems();
        this.draggable = this.draggableElement.nativeElement;
        this.tableBodyElement = this.tableBody.nativeElement;
        this.mouseMove = Observable.fromEvent(document, Events.MOUSE_MOVE).delay(50);

        // cover non-permitted dragging/dropping:
        Observable.fromEvent(document, Events.MOUSE_UP).subscribe(() => this.onMouseUp());
        Observable.fromEvent(this.tableBody.nativeElement, Events.MOUSE_LEAVE).subscribe(() => this._onMouseLeave());
        Observable.fromEvent(this.tableBody.nativeElement, Events.MOUSE_ENTER).subscribe(() => this._onMouseEnter());
    }

    ngAfterContentInit(): void {
        this.columns = this.cols.toArray();
    }

    // public API methods
    onMouseMove(event: MouseEvent) {
        this._updateDraggable(event);
    }

    onMouseOver(event: any, index: number) {

        // only for D&D mode:
        if (!this.dragModeOff && index !== this._currentPlaceHolderIndex) {

            // get mouse location to recognize where to add the placeholder (from top or bottom):
            const middle: number = event.currentTarget.getBoundingClientRect().top + (event.currentTarget.getBoundingClientRect().height / 2);
            const hoveredRow = Object.create(Object.getPrototypeOf(this.draggableItems[index]));
            Object.assign(hoveredRow, this.draggableItems[index]);

            // delete previous:
            if (this._currentPlaceHolderIndex !== -1) {
                this.draggableItems.splice(this._currentPlaceHolderIndex, 1);
            }

            // add placeholder from the bottom:
            if (event.clientY > middle) {
                this._currentPlaceHolderIndex = index + 1;
                this.draggableItems.splice(this._currentPlaceHolderIndex, 0, hoveredRow);
                this.draggableItems[this._currentPlaceHolderIndex].class = 'hovered';
                this._updateView();
            } else { // add placeholder from the top:
                this._currentPlaceHolderIndex = index;
                this.draggableItems.splice(this._currentPlaceHolderIndex, 0, hoveredRow);
                this.draggableItems[this._currentPlaceHolderIndex].class = 'hovered';
                this._updateView();
            }
        }
    }

    onMouseDown(event: MouseEvent, index: number): void {
        // only left button mouse click
        if (event.which === 1) {
            if (this.multipleDragAndDrop) {

                // sign draggable item as 'checked' if it's not:
                const currentClickedIndex = this.getItemIndex(index);
                if (this.selectedIndexes.indexOf(currentClickedIndex) === -1) {
                    this.selectedIndexes = [currentClickedIndex, ...this.selectedIndexes];
                }

                // edge-case when all items are selected - d&d should be disabled
                if (this.selectedIndexes.length === this._value.length) {
                    return;
                }

                this.selectedIndexes.forEach(index => this._value[index].class = 'open');
                this._value = [...this._value];
            }

            event.preventDefault();
            this.currentDraggableItem = this.draggableItems[index];
            this._updateDraggable(event);
            this.dragModeOff = false;
            this._currentDraggedIndex = index;
            this._currentDraggedElement = event.currentTarget;
            this._currentDraggedElement['classList'].add('open');
            this.mouseMoveSubscription = this.mouseMove.subscribe((e: MouseEvent) => this.onMouseMove(e));
            this.renderer.addClass(this.draggable, 'fadeIn');
        }
    }

    onMouseUp(): void {
        if (!this.dragModeOff) {
            this.dragModeOff = true;
            this._currentDraggedElement['classList'].remove('open');
            this._value.forEach(item => delete item['class']);
            this.mouseMoveSubscription.unsubscribe();
            this.renderer.setStyle(document.body, 'cursor', 'default');

            if (this._dropAvailable) {
                if (this._currentPlaceHolderIndex !== -1) {
                    if (this.multipleDragAndDrop) {

                        // save item of this._currentPlaceHolderIndex - we'll need this item to find the entry-point:
                        let insertIndexReference = this.draggableItems[this._currentPlaceHolderIndex];

                        // save all dragged items aside:
                        const draggedItems: any[] = this.selectedIndexes.sort(sortingFunction).map<any>(index => this._value[index + ((index >= this._currentPlaceHolderIndex) ? 1 : 0)]);

                        // remove dragged (selected items) from the original data:
                        draggedItems.forEach(item => this._value.splice(this._value.indexOf(item), 1));

                        // insert draggable items back to the original data but with new order:
                        this._value.splice(this._value.indexOf(insertIndexReference), 1, ...draggedItems);

                        // initiate state:
                        this._currentPlaceHolderIndex = -1;
                        this.selectedIndexes = [];
                        this._orderItems();
                        this._updateView();
                        this.onSelectionChange();
                    }
                    else {
                        const buffer: number = (this._currentDraggedIndex >= this._currentPlaceHolderIndex) ? 1 : 0;
                        // insert dragged item to the new location:
                        this.draggableItems[this._currentPlaceHolderIndex] = this.draggableItems[this._currentDraggedIndex + buffer];

                        // remove dragged item previous location & update view:
                        this.draggableItems.splice(this._currentDraggedIndex + buffer, 1);

                        // initiate state:
                        this._currentPlaceHolderIndex = -1;
                        this._updateView();
                    }
                }
            } else {
                // undroppable area - initiate state:
                this.draggableItems.splice(this._currentPlaceHolderIndex, 1);
                this._currentPlaceHolderIndex = -1;
                this.onSelectionChange();
                this._updateView();
            }
        }
    }

    paginate(event: any) {
        this.unDraggableFromTop = event.first;
        this.unDraggableFromBottom = (event.first + event.rows);
        this.value = [...this.unDraggableItemsFromTop, ...this.draggableItems, ...this.unDraggableItemsFromBottom];
        this.pageChange.emit(event);
    }

    selectAll(event: any): void {
        this.selectedIndexes = (event) ? [...Array.from(Array(this._value.length), (_,x) => x)] : [];
        this.onSelectionChange();
    }

    onSelectionChange(): void {
        this.selectionChange.emit(this.selectedIndexes.sort(sortingFunction).map(index => this._value[index]));
    }

    getItemIndex(index: number): number {
        return this._value.indexOf(this.draggableItems[index]);
    }

    // private methods
    private _updateView(): void {
        this.value = (this.paginator) ? [...this.unDraggableItemsFromTop, ...this.draggableItems, ...this.unDraggableItemsFromBottom] : [...this.draggableItems];
        if (this.dragModeOff) { this.valueChange.emit(this.value); }
    }
    
    private _updateDraggable(event: MouseEvent) {
        this.renderer.setStyle(this.draggable, 'position', 'fixed');
        this.renderer.setStyle(this.draggable, 'left', event.clientX + 20 + 'px');
        this.renderer.setStyle(this.draggable, 'top', event.clientY - 35 + 'px');
    }

    private _onMouseLeave(): void {
        this._dropAvailable = false;
        if (!this.dragModeOff) {
            this.renderer.setStyle(document.body, 'cursor', 'no-drop');
        }
    }

    private _onMouseEnter(): void {
        this._dropAvailable = true;
    }

    private _orderItems() {
        if (!!this.value) {
         if (this.paginator) {
             // once using d&d with pagination page-size has to be increased by 1 because of the added placeholder
             const buffer = (this._currentPlaceHolderIndex === -1) ? 0 : 1;

             this.unDraggableItemsFromTop = [...this.value.slice(0, this.unDraggableFromTop)];
             this.unDraggableItemsFromBottom = [...this.value.slice(this.unDraggableFromBottom + buffer)];
             this.draggableItems = [...this.value.slice(this.unDraggableFromTop, this.unDraggableFromBottom + buffer)];
         } else {
             this.draggableItems = [...this.value];
         }
        }
    }
}
