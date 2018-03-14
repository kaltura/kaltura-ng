import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnChanges } from '@angular/core';
import { AppPermissionsService } from './app-permissions.service';

@Directive({ selector: '[kAuthVisibileIfAll]'})
export class AuthVisibileIfDirective implements OnChanges {

    @Input('kAuthNgIf') condition: boolean = true;
    @Input('kAuthVisibileIfAll') authVisibileIfAll: string[];
    private _isVisible = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private _service: AppPermissionsService) { }

    ngOnChanges(changes)
    {
        if (changes.authVisibileIfAll)
        {
            this._updateAuthentication();
        }

        if (changes.condition)
        {
            this._updateAuthentication();
        }
    }

    private _updateAuthentication(): void{
        const isAuthenticated = this._service.hasAllPermissions(this.authVisibileIfAll);
        const isVisible = this.condition && isAuthenticated;

        if (this._isVisible !== isVisible)
        {
            this._isVisible = isVisible;
            if (this._isVisible)
            {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }else
            {
                this.viewContainer.clear();
            }
        }
    }
}