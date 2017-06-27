import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsComponent } from './tags.component';
import { TagComponent } from './tag.component';

@NgModule({
    imports: <any[]>[
        CommonModule
    ],
    declarations: <any[]>[
        TagsComponent,
        TagComponent
    ],
    exports: <any[]>[
        TagsComponent,
        TagComponent
    ],
    providers: <any[]>[
    ]
})
export class TagsModule {}
