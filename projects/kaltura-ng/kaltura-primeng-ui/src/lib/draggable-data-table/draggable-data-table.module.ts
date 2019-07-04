import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDataTableComponent } from './draggable-data-table.component';
import { ColumnComponent } from './column.component';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';


@NgModule(
  {
    imports: [
      CommonModule,
      CheckboxModule,
      PaginatorModule
    ],
    declarations: [
      DraggableDataTableComponent,
      ColumnComponent
    ],
    exports: [
      DraggableDataTableComponent,
      ColumnComponent
    ],
    providers: []
  }
)
export class DraggableDataTableModule {

}
