import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsBarComponent } from './details-bar.component';
import { DetailInfoComponent } from "./detail-info.component";
import { TooltipModule } from "../tooltip/k-tooltip.module";

@NgModule({
    imports: [
        CommonModule,
        TooltipModule
    ],
    declarations: [
        DetailsBarComponent,
        DetailInfoComponent
    ],
    exports: [
        DetailsBarComponent,
        DetailInfoComponent
    ],
    providers: [
    ]
})
export class DetailsBarModule {
}
