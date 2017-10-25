export interface OperationTagManagerProxy {
    increase: (tag: string) => void;
    decrease: (tag: string) => void;
}

export class OperationTagStoreMediator{

    private static _operationsTagManager: OperationTagManagerProxy = null;

    public static register(operationsTagManager: OperationTagManagerProxy){
        this._operationsTagManager = operationsTagManager;
    }

    public static increase(tag: string){
        if (this._operationsTagManager){
            this._operationsTagManager.increase(tag);
        }
    }

    public static decrease(tag: string){
        if (this._operationsTagManager){
            this._operationsTagManager.decrease(tag);
        }
    }

}