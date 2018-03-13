import {
    ElementRef, Input, OnChanges,
    Directive
} from '@angular/core';
import { AppPermissionsService } from './app-permissions.service';

@Directive({ selector: 'button[kAuthEnableIfAll]'})
export class AuthEnableIfDirective implements OnChanges {
    @Input('kAuthEnableIfAll') authEnableIfAll: string[];
    private _isAuthenticated = true;

    constructor(private _service: AppPermissionsService, private _element: ElementRef) {
    }

    ngOnChanges(changes) {
        if (changes.authEnableIfAll) {
            this._updateAuthentication();
        }
    }

    private _updateAuthentication(): void {
        const isAuthenticated = this._service.hasAllPermissions(this.authEnableIfAll);

        if (this._isAuthenticated !== isAuthenticated) {
            this._isAuthenticated = isAuthenticated;
            this._updateLayout();
        }
    }

    private _updateLayout(): void {
        if (this._element) {
            this._element.nativeElement.disabled = !this._isAuthenticated;
        }
    }
}

