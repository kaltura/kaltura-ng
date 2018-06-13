import { NgModule } from '@angular/core';
import { KPSortableColumn } from './k-p-sortable-column';

/**
 * @deprecated use separated module for each component
 */
@NgModule({
    imports: <any[]>[

    ],
    declarations: <any[]>[
        KPSortableColumn
    ],
    exports: <any[]>[
        KPSortableColumn
    ],
    providers: <any[]>[
    ]
})
export class KPTableModule {}
