import {
    Directive
} from '@angular/core';
import { Tree } from 'primeng/tree';

export interface PrimeItem
{
    parent?: PrimeItem;
    children: PrimeItem[];
    partialSelected: boolean;
}

@Directive({
    selector: 'p-tree[kRefinePrimeTree]',
})
export class RefinePrimeTree {


    constructor(private _treeComponent: Tree) {

    }

    fixPropagation(): void {
        const selection = this._treeComponent.selection = (this._treeComponent.selection || []);

        if (this._treeComponent.value) {
            this._treeComponent.value.forEach(parent => {
                const isParentSelected = selection.indexOf(parent) !== -1;

                if (parent.children && parent.children.length > 0) {
                    let selectedChildrenCount = parent.children.reduce((acc, child) => {

                        return acc + (selection.indexOf(child) !== -1 ? 1 : 0);
                    }, 0);

                    let shouldBeSelected = selectedChildrenCount === parent.children.length;

                    if (!shouldBeSelected) {
                        if (isParentSelected) {
                            selection.splice(
                                selection.indexOf(parent),
                                1
                            );
                        }

                        parent.partialSelected = (selectedChildrenCount > 0);

                    } else if (shouldBeSelected && !isParentSelected) {
                        selection.push(parent);
                        parent.partialSelected = false;
                    }
                }
            });
        }
    }
}
