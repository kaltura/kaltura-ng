

import { PipeTransform } from '@angular/core';

export const enum Modes{
    AllowIfAnyExists,
    AllowIfNoneExists
}

export abstract class ActionPermittedPipeBase<T> implements PipeTransform {

    constructor(private _modes: Modes) {

    }

    private _createResult(hasAnyPermissions: boolean): boolean {
        return this._modes === Modes.AllowIfAnyExists ? hasAnyPermissions : !hasAnyPermissions;
    }

    transform(permission: T[] | T): boolean {
        if (typeof permission === 'undefined' || permission === null) {
            return this._createResult(false);
        }

        if (Array.isArray(permission) && (<any>permission).length === 0) {
            return this._createResult(true);
        }

        const permissionList = Array.isArray(permission) ? permission : [permission];
        const hasAnyPermissions = this.hasAnyPermissions(permissionList);

        return this._createResult(hasAnyPermissions);
    }

    protected abstract hasAnyPermissions(permissionList: T[]): boolean;
}
