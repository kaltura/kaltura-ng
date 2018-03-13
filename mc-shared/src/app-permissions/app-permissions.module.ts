import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPermissionsService } from './app-permissions.service';
import { AuthEnableIfDirective } from './auth-enable-if.directive';
import { AuthVisibileIfDirective } from './auth-visible-if.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AuthVisibileIfDirective,
        AuthEnableIfDirective
        ],
    exports: [
        AuthVisibileIfDirective,
        AuthEnableIfDirective
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