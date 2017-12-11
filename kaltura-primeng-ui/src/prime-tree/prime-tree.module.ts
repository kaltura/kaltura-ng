import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTreeDataProvider } from './prime-tree-data-provider.service';
import { PrimeTreePropagation } from './prime-tree-propagation.directive';
import { TreeModule } from 'primeng/primeng';
import { PrimeTreeActions } from './prime-tree-actions.directive';

@NgModule({
    imports: [CommonModule, TreeModule],
    declarations: [
        PrimeTreePropagation,
        PrimeTreeActions],
    exports: [
        PrimeTreePropagation,
        PrimeTreeActions]
})
export class PrimeTreeModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PrimeTreeModule,
            providers: <any[]>[
                PrimeTreeDataProvider
            ]
        };
    }
}