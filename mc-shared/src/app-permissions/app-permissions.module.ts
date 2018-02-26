import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPermissionsService } from './app-permissions.service';

@NgModule({
    imports: [],
    declarations: [
        ],
    exports: [
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