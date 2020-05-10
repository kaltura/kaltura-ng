import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupWidgetComponent } from './popup-widget.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PopupWidgetComponent
    ],
    exports: [
        PopupWidgetComponent
    ],
    providers: [
    ]
})
export class PopupWidgetModule {}
