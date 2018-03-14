import {
    ElementRef, Input, OnChanges,
    Directive
} from '@angular/core';
import { AppPermissionsService } from './app-permissions.service';

@Directive({ selector: 'button[kEnableIfAllPermitted]'})
export class EnableIfPermitted implements OnChanges {
    @Input('kEnableIf') condition: boolean = true;
    @Input('kEnableIfAllPermitted') enableIfAllPermitted: string[];


    private _isEnabled = true;

    constructor(private _service: AppPermissionsService, private _element: ElementRef) {
    }

    ngOnChanges(changes) {
        if (changes.enableIfAllPermitted) {
            this._updateAuthentication();
        }

        if (changes.condition)
        {
            this._updateAuthentication();
        }
    }

    private _updateAuthentication(): void {
        const isAuthenticated = this._service.hasAllPermissions(this.enableIfAllPermitted);
        const isEnabled = this.condition && isAuthenticated;


        if (this._isEnabled !== isEnabled) {
            this._isEnabled = isEnabled;
            this._updateLayout();
        }
    }

    private _updateLayout(): void {
        if (this._element) {
            this._element.nativeElement.disabled = !this._isEnabled;
        }
    }
}

