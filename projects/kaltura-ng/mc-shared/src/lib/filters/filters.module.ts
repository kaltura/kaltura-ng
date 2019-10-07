import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { RefinePrimeTree } from './refine-prime-tree.directive';

@NgModule({
    imports: [CommonModule, TreeModule],
    declarations: [
        RefinePrimeTree],
    exports: [
        RefinePrimeTree]
})
export class FiltersModule {
}
