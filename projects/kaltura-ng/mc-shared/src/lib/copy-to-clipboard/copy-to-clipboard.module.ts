import { NgModule } from '@angular/core';
import {TooltipModule} from "@kaltura-ng/kaltura-ui";
import {CopyToClipboardComponent} from "./copy-to-clipboard.component";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        TooltipModule
    ],
    declarations: [
        CopyToClipboardComponent],
    exports: [
        CopyToClipboardComponent]
})
export class CopyToClipboardModule {
}
