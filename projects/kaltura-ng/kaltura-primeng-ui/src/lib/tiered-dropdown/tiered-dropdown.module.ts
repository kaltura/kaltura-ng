import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TieredMenu, TieredMenuModule} from 'primeng/tieredmenu';
import {TieredDropdownComponent} from './tiered-dropdown.component';
import {TieredDropdownSubComponent} from './tiered-dropdown-sub/tiered-dropdown-sub.component';
import {ButtonModule} from 'primeng/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PrimeTemplate, SharedModule} from 'primeng/components/common/shared';
import {RouterModule} from '@angular/router';



@NgModule(
  {
    imports: [
      CommonModule,
      ButtonModule,
      BrowserAnimationsModule,
      SharedModule,
      RouterModule
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
