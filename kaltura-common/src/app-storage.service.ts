

export interface IAppStorage {
    setInLocalStorage(key:string, value:any) : void;
    getFromLocalStorage(key:string) : any;
    removeFromLocalStorage(key:string) : any;
    setInSessionStorage(key:string, value:any) : void;
    getFromSessionStorage(key:string) : any;
    removeFromSessionStorage(key:string) : any;
}

export class AppStorage implements IAppStorage{
    private storage : any = {};

    setInLocalStorage(key:string, value:any):void {
        this.storage[key] = value;
    }

    getFromLocalStorage(key:string):any {
        return this.storage[key];
    }

    removeFromLocalStorage(key:string):any {
       delete this.storage[key];
    }

    setInSessionStorage(key:string, value:any):void {
        this.storage[key] = value;
    }

    getFromSessionStorage(key:string):any {
        return this.storage[key];
    }

    removeFromSessionStorage(key:string):any {
        delete this.storage[key];
    }

}