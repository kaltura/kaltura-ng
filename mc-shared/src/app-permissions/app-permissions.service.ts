import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/from';
import * as Immutable from 'seamless-immutable';

enum CompareTypes
{
    All,
    Match
}

@Injectable()
export class AppPermissionsService {

    private _permissions: Immutable.ImmutableObjectMixin<{ [key: string]: boolean }>;

    constructor() {
    }

    /**
     * Remove all permissions from permissions source
     */
    public flushPermissions(): void {
        this._permissions = null;
    }

    public hasPermission(permission: string): boolean {
        if (!permission)
        {
            return false;
        }

        return this._hasArrayPermission([permission], CompareTypes.Match);
    }

    public hasAllPermissions(permissions: string[]): boolean {
        if (!permissions)
        {
            return false;
        } else if (permissions.length === 0) {
            return true;
        }

        return this._hasArrayPermission(permissions, CompareTypes.All);
    }

    public loadPermissions(permissions: string[]): void {
        const newPermissions = permissions.reduce((source, p) =>
        {
            source[p] = true;
            return source;
        }
            , {});

        this._permissions = Immutable(newPermissions);
    }

    private _hasArrayPermission(permissions: string[], compareType: CompareTypes): boolean {
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
                    return !!this._permissions[permission];
                });
                break;
            case CompareTypes.Match:
                result = permissions.some(permission =>
                {
                    return !!this._permissions[permission];
                });
                break;
        }

        return result;
    }
    
    public filterList(list: { id: string }[], permissionMapping: { [id: string]: string | string[] }): void {
        Object.keys(permissionMapping).forEach(key => {
            const permission = permissionMapping[key];
            const hasPermission = Array.isArray(permission)
              ? this.hasAllPermissions(permission)
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