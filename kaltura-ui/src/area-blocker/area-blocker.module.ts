import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaBlockerComponent } from './area-blocker.component';

@NgModule(
    {
        imports : [
          CommonModule
        ],
        declarations : [
            AreaBlockerComponent
        ],
        exports : [
            AreaBlockerComponent
        ],
        providers : [
        ]
    }
)
export class AreaBlockerModule
{

}