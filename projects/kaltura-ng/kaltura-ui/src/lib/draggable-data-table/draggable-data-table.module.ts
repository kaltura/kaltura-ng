import { NgModule } from '@angular/core';
import { DraggableDataTableComponent } from "./draggable-data-table.component";
import { ColumnComponent } from "./column.component";


@NgModule(
    {
        imports : [],
        declarations : [
          DraggableDataTableComponent,
          ColumnComponent
        ],
        exports : [
            DraggableDataTableComponent,
            ColumnComponent
        ],
        providers : []
    }
)
export class DraggableDataTableModule
{

} 
