import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupWidgetModule } from '../popup-widget/popup-widget.module';
import { InputHelperComponent } from './input-helper.component';

@NgModule({
    imports: [
        CommonModule,
        PopupWidgetModule
    ],
    declarations: [
	    InputHelperComponent
    ],
    exports: [
	    InputHelperComponent
    ],
    providers: [
    ]
})
export class InputHelperModule {}
