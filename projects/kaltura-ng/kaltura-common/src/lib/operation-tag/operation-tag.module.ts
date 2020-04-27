
import { Self, Optional, NgModule, ModuleWithProviders } from '@angular/core';
import {OperationTagStoreMediator} from "./operation-tag-store-mediator";
import {OperationTagManagerService} from "./operation-tag-manager.service";

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: [
    ]
})
export class OperationTagModule {

    // Prevents angular from creating another instance for operationTagManagerService when defined as provider in more than one place
    // (Each component will get the same instance as in the module/component that called the operationTagManagerService.forRoot)
    constructor(@Self() @Optional() operationTagManagerService: OperationTagManagerService){
        if (operationTagManagerService) {
            OperationTagStoreMediator.register(operationTagManagerService);
        }
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: OperationTagModule,
            providers: <any[]>[
                OperationTagManagerService
            ]
        };
    }
}
