import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupWidgetModule } from '../popup-widget';
import { InputHelperComponent } from './input-helper.component';

@NgModule({
    imports: <any[]>[
        CommonModule,
        PopupWidgetModule
    ],
    declarations: <any[]>[
	    InputHelperComponent
    ],
    exports: <any[]>[
	    InputHelperComponent
    ],
    providers: <any[]>[
    ]
})
export class InputHelperModule {}
