import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPermissionsService } from './app-permissions.service';
import {
    HtmlEnableIfPermitted,
    PrimeDropdownEnableIfPermitted
} from './enable-if-permitted.directive';
import { VisibleIfPermitted } from './visible-if-permitted.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        VisibleIfPermitted,
        PrimeDropdownEnableIfPermitted,
        HtmlEnableIfPermitted
        ],
    exports: [
        VisibleIfPermitted,
        PrimeDropdownEnableIfPermitted,
        HtmlEnableIfPermitted
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