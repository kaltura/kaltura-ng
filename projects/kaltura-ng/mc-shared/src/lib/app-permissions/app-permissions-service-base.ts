import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/from';
import { Immutable } from 'seamless-immutable';

enum CompareTypes
{
    All,
    Match
}

export abstract class AppPermissionsServiceBase<T> {

    private _permissions: Immutable.ImmutableObjectMixin<{ [key: string]: boolean }>;

    constructor() {
    }

    /**
     * Remove all permissions from permissions source
     */
    public flushPermissions(): void {
        this._permissions = null;
    }

    public hasPermission(permission: T): boolean {
        if (!permission)
        {
            return false;
        }

        return this._hasArrayPermission([permission], CompareTypes.Match);
    }

    public hasAnyPermissions(permissions: T[]): boolean {
        if (!permissions)
        {
            return false;
        } else if (permissions.length === 0) {
            return true;
        }

        return this._hasArrayPermission(permissions, CompareTypes.Match);
    }

    protected loadPermissions(permissions: T[]): void {
        const newPermissions = permissions.reduce((source, p) =>
        {
            const formattedPermissionToken = this._convertToPermissionTokens(p);
            if (formattedPermissionToken) {
                source[formattedPermissionToken] = true;
            }
            return source;
        }
            , {});

        this._permissions = Immutable(newPermissions);
    }

    private _convertToPermissionTokens(arg: T[]): string[];
    private _convertToPermissionTokens(arg: T): string;
    private _convertToPermissionTokens(arg: T | T[]): string | string[]{
        if (Array.isArray(arg))
        {
            return (<any>arg).map(value => (String(value) || '').toUpperCase());
        }else {
            return (String(arg) || '').toUpperCase();
        }
    }

    private _hasArrayPermission(permissions: T[], compareType: CompareTypes): boolean {
        if (!this._permissions)
        {
            return false;
        }

        let result = false;

        switch (compareType)
        {
            case CompareTypes.All:
                result = permissions.every(permission =>
                {
                    const formattedPermissionToken = String(permission || '').toUpperCase();
                    return formattedPermissionToken && !!this._permissions[formattedPermissionToken];
                });
                break;
            case CompareTypes.Match:
                result = permissions.some(permission =>
                {
                    const formattedPermissionToken = String(permission || '').toUpperCase();
                    return formattedPermissionToken && !!this._permissions[formattedPermissionToken];
                });
                break;
        }

        return result;
    }

    public filterList(list: { id: string }[], permissionMapping: { [id: string]: T | T[] }): void {
        Object.keys(permissionMapping).forEach(key => {
            const permission = permissionMapping[key];
            const hasPermission = Array.isArray(permission)
              ? this.hasAnyPermissions(permission)
              : this.hasPermission(permission);

          if (!hasPermission) {
            const relevantItems = list.filter(({ id }) => id === key);
            const relevantItemIndex = relevantItems && relevantItems.length ? list.indexOf(relevantItems[0]) : -1;

            if (relevantItemIndex !== -1) {
              list.splice(relevantItemIndex, 1);
            }
          }
        });
    }
}
