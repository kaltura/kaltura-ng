import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnChanges } from '@angular/core';
import { AppPermissionsService } from './app-permissions.service';

@Directive({ selector: '[kAuthVisibileIfAll]'})
export class AuthVisibileIfDirective implements OnChanges {

    @Input('kAuthVisibileIfAll') authVisibileIfAll: string[];
    isAuthenticated = false;

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
    }

    private _updateAuthentication(): void{
        const isAuthenticated = this._service.hasAllPermissions(this.authVisibileIfAll);

        if (this.isAuthenticated !== isAuthenticated)
        {
            this.isAuthenticated = isAuthenticated;
            if (this.isAuthenticated)
            {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }else
            {
                this.viewContainer.clear();
            }
        }
    }
}