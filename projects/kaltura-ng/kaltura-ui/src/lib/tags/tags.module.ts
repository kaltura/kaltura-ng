import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsComponent } from './tags.component';
import { TagComponent } from './tag.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TagsComponent,
        TagComponent
    ],
    exports: [
        TagsComponent,
        TagComponent
    ],
    providers: [
    ]
})
export class TagsModule {}
