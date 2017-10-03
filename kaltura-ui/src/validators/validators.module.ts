import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupWidgetComponent } from './popup-widget.component';
import {Validators} from "./validators";

@NgModule({
    imports: <any[]>[
        // CommonModule
    ],
    declarations: <any[]>[
        Validators
    ],
    exports: <any[]>[
        Validators
    ],
    providers: <any[]>[
    ]
})
export class PopupWidgetModule {}
