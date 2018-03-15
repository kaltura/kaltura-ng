import {
    ElementRef, Input, OnChanges,
    Directive, EventEmitter, Optional, Host, Renderer2, Output
} from '@angular/core';
import { AppPermissionsService } from './app-permissions.service';
import { AbstractControl } from '@angular/forms';
import { Dropdown } from 'primeng/primeng';

export abstract class EnableIfPermitted implements OnChanges {
    @Input('kEnableIf') condition: boolean = true;
    @Input('kEnableIfAllPermitted') enableIfAllPermitted: string[];

    @Input() disabled: boolean;
    @Output() disabledChange: EventEmitter<boolean>;

    protected _isEnabled = true;

    constructor(private _service: AppPermissionsService) {
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
            this._updateLayout(isEnabled);
        }
    }

    protected abstract _updateLayout(isEnabled: boolean): void;
}

@Directive({ selector: 'button[kEnableIfAllPermitted]'})
export class HtmlEnableIfPermitted extends EnableIfPermitted {

    constructor(_service: AppPermissionsService, private _element: ElementRef,
                private _renderer: Renderer2) {
        super(_service);
    }

    protected _updateLayout(isEnabled: boolean): void {
        this._renderer.setProperty(this._element.nativeElement, 'disabled', isEnabled);
    }
}

@Directive({ selector: 'p-dropdown[kEnableIfAllPermitted]'})
export class PrimeDropdownEnableIfPermitted extends EnableIfPermitted {

    constructor(_service: AppPermissionsService, private _control: Dropdown) {
        super(_service);
    }

    protected _updateLayout(isEnabled: boolean): void {
        this._control.disabled = !isEnabled;

    }
}

