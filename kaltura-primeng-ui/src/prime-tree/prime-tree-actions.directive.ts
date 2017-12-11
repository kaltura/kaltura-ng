import {
    Directive
} from '@angular/core';
import { Tree } from 'primeng/primeng';

@Directive({
    selector: 'p-tree[kPrimeTreeActions]',
})
export class PrimeTreeActions  {


    constructor(private _treeComponent : Tree)
    {

    }

    fixPropagation(): void
    {
        const selection = this._treeComponent.selection;
        if (selection && selection.length)
        {
            selection.forEach(node =>{
               this._treeComponent.propagateUp(node,true);
            });
        }
    }

}
