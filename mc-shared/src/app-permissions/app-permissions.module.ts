import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPermissionsService } from './app-permissions.service';
import { NotPermittedPipe } from './not-permitted-pipe';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NotPermittedPipe
        ],
    exports: [
        NotPermittedPipe
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