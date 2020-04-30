
import { Directive, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Table } from 'primeng/table';
import { DomHandler } from 'primeng/dom';

@Directive({
    selector: '[kpSortableColumn]',
    host: {
        '[class.ui-sortable-column]': 'isEnabled',
        '[class.ui-state-highlight]': 'sorted'
    }
})
export class KPSortableColumn implements OnInit, OnDestroy {

    @Input("kpSortableColumn") field: string;

    isEnabled: boolean;
    sorted: boolean;

    subscription: Subscription;

    constructor(public dt: Table) {
        this.subscription = this.dt.tableService.sortSource$.subscribe(sortMeta => {
            this.updateSortState();
        });
    }

    ngOnInit() {
        this.updateSortState();
        this.isEnabled = !!this.field;
    }

    updateSortState() {
        if (this.isEnabled) {
            this.sorted = this.dt.isSorted(this.field);
        }
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isEnabled) {
            this.dt.sort({
                originalEvent: event,
                field: this.field
            });

          DomHandler.clearSelection();
        }
    }

    ngOnDestroy() {
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
