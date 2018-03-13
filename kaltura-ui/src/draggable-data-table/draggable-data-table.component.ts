import {
    AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
    QueryList, Renderer2, TemplateRef, ViewChild
} from '@angular/core';
import {ColumnComponent} from './column.component';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import "rxjs/add/operator/delay";

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
    @Input() draggableViewTemplate: TemplateRef<any>;
    @Output() valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();
    @ViewChild('draggable') private draggableElement: ElementRef;
    @ViewChild('tableBody') private tableBody: ElementRef;
    @ContentChildren(ColumnComponent) cols: QueryList<ColumnComponent>;
    currentDraggableItem: any;
    draggable: any;
    tableBodyElement: any;
    columns: ColumnComponent[];
    dragModeOff = true;
    selectedValues = [];
    mouseMoveSubscription: Subscription;
    mouseMove: Observable<any>;
    public unDraggableItemsFromTop: any[];
    public unDraggableItemsFromBottom: any[];
    public draggableItems: any[];
    private _currentDraggedIndex: number;
    private _currentPlaceHolderIndex: number = -1;
    private _currentDraggedElement: EventTarget;
    private _value: any[];
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
        return this._value;
    }

    @Input() unDraggableFromTop = 0;
    @Input() unDraggableFromBottom = 0;
    @Input() rowTrackBy: Function = (index: number, item: any) => item;
    @Input() columnTrackBy: Function = (index: number, item: any) => item;
    @Input() paginator = false;
    @Input() rows: number;
    @Input() rowsPerPageOptions: number[];
    @Input() selectable = false;
    @Input() showIndex = false;
    @Output() onItemsSelected: EventEmitter<any[]> = new EventEmitter<any[]>();

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
        if (event.which === 1) { // only left button mouse click
            event.preventDefault();
            this.currentDraggableItem = this.draggableItems[index];
            this._updateDraggable(event);
            this.dragModeOff = false;
            this._currentDraggedIndex = index;
            this._currentDraggedElement = event.currentTarget;
            this._currentDraggedElement['classList'].add('open');
            this.mouseMoveSubscription = this.mouseMove.subscribe((e: MouseEvent) => this.onMouseMove(e));
            this.renderer.addClass(this.draggable, 'fadeIn');
            this.renderer.setStyle(this.tableBody.nativeElement, 'cursor', 'move');
        }
    }

    onMouseDownOnCheckbox(): void {
        // empty method for overwriting D&D mouse-down event
    }

    onMouseUp(): void {
        if (!this.dragModeOff) {
            this.dragModeOff = true;
            this._currentDraggedElement['classList'].remove('open');
            this.mouseMoveSubscription.unsubscribe();
            this.renderer.setStyle(document.body, 'cursor', 'default');
            this.renderer.setStyle(this.tableBody.nativeElement, 'cursor', 'default');

            if (this._dropAvailable) {
                if (this._currentPlaceHolderIndex !== -1) {
                    const buffer: number = (this._currentDraggedIndex >= this._currentPlaceHolderIndex) ? 1 : 0;

                    // insert dragged item to the new location:
                    this.draggableItems[this._currentPlaceHolderIndex] = this.draggableItems[this._currentDraggedIndex + buffer];

                    // remove dragged item previous location & update view:
                    this.draggableItems.splice(this._currentDraggedIndex + buffer, 1);
                    this._updateView();

                    // initiate state:
                    this._currentPlaceHolderIndex = -1;
                }
            } else {
                // initiate state:
                this.draggableItems.splice(this._currentPlaceHolderIndex, 1);
                this._updateView();
                this._currentPlaceHolderIndex = -1;
            }
        }
    }

    paginate(event: any) {
        this.unDraggableFromTop = event.first;
        this.unDraggableFromBottom = (event.first + event.rows);
        this._value = [...this.unDraggableItemsFromTop, ...this.draggableItems, ...this.unDraggableItemsFromBottom];
    }

    selectAll(event: any): void {
        if(event) {
            for (let i = 0; i < this._value.length; i++) {
                this.selectedValues.push(i);
            }
            this.selectedValues = [...Array.from(new Set<any>(this.selectedValues.map((item: any) => item)))];
        } else {
            this.selectedValues = [];
        }

        this.emitOnItemsSelected();
    }

    emitOnItemsSelected(): void {
        const selectedItems: any[] = [];
        this.selectedValues.forEach(index => selectedItems.push(this.draggableItems[index]));
        this.onItemsSelected.emit(selectedItems);
    }

    getItemIndex(index: number): number {
        return this._value.indexOf(this.draggableItems[index]);
    }

    // private methods
    _updateView(): void {
        this._value = [...this.unDraggableItemsFromTop, ...this.draggableItems, ...this.unDraggableItemsFromBottom];
        this.valueChange.emit(this._value);
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
        if (!this.dragModeOff) {
            this.renderer.setStyle(this.tableBody.nativeElement, 'cursor', 'move');
        }
    }

    private _orderItems() {
        if (!!this.value) {
            // once using d&d pagination page-size has to be increased by 1 because of the added placeholder
            const buffer = (this.paginator && this._currentPlaceHolderIndex === -1) ? 0 : 1;

            this.unDraggableItemsFromTop = [...this.value.slice(0, this.unDraggableFromTop)];
            this.unDraggableItemsFromBottom = [...this.value.slice(this.unDraggableFromBottom + buffer)];
            this.draggableItems = [...this.value.slice(this.unDraggableFromTop, this.unDraggableFromBottom + buffer)];
        }
    }
}
