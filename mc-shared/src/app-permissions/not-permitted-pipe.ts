

import { Pipe, PipeTransform } from '@angular/core';
import { AppPermissionsService } from './app-permissions.service';

@Pipe({ name: 'kNotPermitted' })
export class NotPermittedPipe implements PipeTransform {
    constructor(private _service: AppPermissionsService) {
    }

    transform(permission: string[] | string): boolean {
        if (permission === 'undefined' || permission === null) {
            return false;
        }

        if (!permission || (Array.isArray(permission) && permission.length === 0)) {
            return true
        }

        const permissionList = Array.isArray(permission) ? permission : [permission];
        return !this._service.hasAnyPermissions(permissionList);
    }
}
