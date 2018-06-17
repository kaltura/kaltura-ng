import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { ButtonModule } from 'primeng/components/button/button';
import { SharedModule } from 'primeng/components/common/shared';
import { AutoComplete } from "./auto-complete.component";
import { HighlightPipe } from "./highlight.pipe";
import { IsSuggestionDisabledPipe } from "./is-suggestion-disabled.pipe";

@NgModule({
    imports: [CommonModule, InputTextModule, ButtonModule, SharedModule, TooltipModule],
    declarations: [AutoComplete, HighlightPipe, IsSuggestionDisabledPipe],
    exports: [AutoComplete, HighlightPipe],

})
export class AutoCompleteModule {
}
