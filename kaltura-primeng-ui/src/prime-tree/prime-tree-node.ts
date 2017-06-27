import { TreeNode } from "primeng/components/common/api";
import { NodeChildrenStatuses } from './prime-tree-data-provider.service';

export class PrimeTreeNode implements TreeNode{

    // list of properties required by the interface which were not altered by PrimeTreeNode
    public icon?: any;
    public expandedIcon?: any;
    public collapsedIcon?: any;
    public expanded?: boolean;
    public type?: string;
    public parent?: PrimeTreeNode;
    public partialSelected?: boolean;

    // PrimeTreeNode properties
    private _children : PrimeTreeNode[] = null;
    private _childrenCount : number = null;
    private _childrenStatus: NodeChildrenStatuses = NodeChildrenStatuses.missing;
    public _childrenLoadError : string;
    public selectable : boolean = true;

    public get hasChildren() : boolean
    {
        return this._childrenCount != null && this._childrenCount > 0;
    }

    public expand() : void
    {
        // expand tree to show selected node
        let nodeParent= this.parent;
        while(nodeParent != null)
        {
            nodeParent.expanded = true;
            nodeParent = nodeParent.parent;
        }
    }

    constructor(public data: string | number, public label : string,  children : PrimeTreeNode[] | number = null, public origin : any, public payload : any = null) {
        if (children !== null) {
            if (!isNaN(<any>children) && isFinite(<any>children)) {
                this.setChildrenCount(<number>children);
            } else {
                this.setChildren(<PrimeTreeNode[]>children);
            }
        }
    }

    public get childrenStatus() : NodeChildrenStatuses
    {
        return this._childrenStatus;
    }

    public get childrenLoadError() : string
    {
        return this._childrenLoadError;
    }

    public get leaf() : boolean
    {
        return this._children !== null ? (this._children.length === 0) : (this._childrenCount == null || this._childrenCount === 0);
    }

    public get childrenCount() : number
    {
        return this._childrenCount !== null ? this._childrenCount : this._children ? this._children.length : 0;
    }

    public setChildrenLoadStatus(status : NodeChildrenStatuses, errorMessage? : string)
    {
        this._childrenStatus = status;
        this._childrenLoadError = errorMessage;
    }

    public setChildrenCount(value : number)
    {
        this._childrenCount = value;
        this._children = null;
        this.setChildrenLoadStatus(NodeChildrenStatuses.missing);
    }

    public setChildren(value :  PrimeTreeNode[])
    {
        this._childrenCount = null;
        this._children = value;
        this.setChildrenLoadStatus(NodeChildrenStatuses.loaded);
    }

    public get children() : PrimeTreeNode[]
    {
        return this._children;
    }



}