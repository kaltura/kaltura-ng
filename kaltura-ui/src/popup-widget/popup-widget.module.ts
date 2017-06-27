import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupWidgetComponent } from './popup-widget.component';

@NgModule({
    imports: <any[]>[
        CommonModule
    ],
    declarations: <any[]>[
        PopupWidgetComponent
    ],
    exports: <any[]>[
        PopupWidgetComponent
    ],
    providers: <any[]>[
    ]
})
export class PopupWidgetModule {}
