
import { Self, Optional, NgModule, ModuleWithProviders } from '@angular/core';
import {OperationTagStoreMediator} from "./operation-tag-store-mediator";
import {OperationTagManagerService} from "./operation-tag-manager.service";

@NgModule({
    imports: <any[]>[
    ],
    declarations: <any[]>[
    ],
    exports: <any[]>[
    ],
    providers: <any[]>[
    ]
})
export class OperationTagModule {

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
