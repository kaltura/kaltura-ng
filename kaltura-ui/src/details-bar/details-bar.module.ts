import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsBarComponent } from './details-bar.component';

@NgModule(
    {
        imports : [
          CommonModule
        ],
        declarations : [
            DetailsBarComponent
        ],
        exports : [
            DetailsBarComponent
        ],
        providers : [
        ]
    }
)
export class DetailsBarModule
{

}