import { NgModule } from '@angular/core';
import { KPSortableColumn } from './k-p-sortable-column';

/**
 * @deprecated use separated module for each component
 */
@NgModule({
    imports: [

    ],
    declarations: [
        KPSortableColumn
    ],
    exports: [
        KPSortableColumn
    ],
    providers: [
    ]
})
export class KPTableModule {}
