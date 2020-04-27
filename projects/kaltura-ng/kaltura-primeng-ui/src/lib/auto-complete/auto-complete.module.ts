import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';
import { InputTextModule } from 'primeng/inputtext/inputtext';
import { ButtonModule } from 'primeng/button/button';
import { AutoComplete } from "./auto-complete.component";
import { HighlightPipe } from "./highlight.pipe";
import { IsSuggestionDisabledPipe } from "./is-suggestion-disabled.pipe";

@NgModule({
    imports: [CommonModule, InputTextModule, ButtonModule, TooltipModule],
    declarations: [AutoComplete, HighlightPipe, IsSuggestionDisabledPipe],
    exports: [AutoComplete, HighlightPipe],

})
export class AutoCompleteModule {
}
