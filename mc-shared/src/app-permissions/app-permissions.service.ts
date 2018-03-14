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

    private _permissions = new BehaviorSubject<Immutable.ImmutableObjectMixin<{ [key: string]: boolean }>>(Immutable({}));
    public permissions$ = this._permissions.asObservable();

    constructor() {
    }

    /**
     * Remove all permissions from permissions source
     */
    public flushPermissions(): void {
        this._permissions.next(Immutable({}));
    }

    public hasMatchingPermissions(permission: string | string[]): boolean {
        if (!permission)
        {
            return false;
        }
        else if ((Array.isArray(permission) && permission.length === 0)) {
            return true;
        }

        let permissionList: string[] = null;
        if  (permission && typeof permission === 'string')
        {
            permissionList = [permission];
        }else {
            permissionList = <string[]>permission;
        }
        return this._hasArrayPermission(permissionList, CompareTypes.Match);
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

        this._permissions.next(Immutable(newPermissions));
    }

    private _hasArrayPermission(permissions: string[], compareType: CompareTypes): boolean {
        const permissionsStore = this._permissions.getValue();
        let result = false;

        switch (compareType)
        {
            case CompareTypes.All:
                result = permissions.every(permission =>
                {
                    return !!permissionsStore[permission];
                });
                break;
            case CompareTypes.Match:
                result = permissions.some(permission =>
                {
                    return !!permissionsStore[permission];
                });
                break;
        }

        return result;
    }
}