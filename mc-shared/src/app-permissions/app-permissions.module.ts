import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPermissionsService } from './app-permissions.service';
import { EnableIfPermitted } from './enable-if-permitted.directive';
import { VisibleIfPermitted } from './visible-if-permitted.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        VisibleIfPermitted,
        EnableIfPermitted
        ],
    exports: [
        VisibleIfPermitted,
        EnableIfPermitted
        ]
})
export class AppPermissionsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppPermissionsModule,
            providers: <any[]>[
                AppPermissionsService
            ]
        };
    }
}