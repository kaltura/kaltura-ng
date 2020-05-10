import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TieredMenuModule} from 'primeng/tieredmenu';
import {TieredDropdownComponent} from './tiered-dropdown.component';
import {TieredDropdownSubComponent} from './tiered-dropdown-sub/tiered-dropdown-sub.component';
import {ButtonModule} from 'primeng/button';

@NgModule(
  {
    imports: [
      CommonModule,
      ButtonModule,
      TieredMenuModule
    ],
    declarations: [
      TieredDropdownComponent,
      TieredDropdownSubComponent
    ],
    exports: [
      TieredDropdownComponent,
      TieredDropdownSubComponent,
    ],
    providers: []
  }
)
export class TieredDropdownModule {

}
