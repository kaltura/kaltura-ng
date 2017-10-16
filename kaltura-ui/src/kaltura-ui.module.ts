import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDialogComponent } from './components/file-dialog/file-dialog.component';
import { StickyComponent } from './components/sticky/sticky.component';
import { KalturaPlayerComponent } from './player/player.component';
import { DatePipe } from './date.pipe';
import { SafePipe } from './safe.pipe';
import { TimePipe } from './time.pipe';
import { FileSizePipe } from './file-size.pipe';
import { StickyNavDirective } from './directives/sticky-nav.directive';
import { LineBreakPipe } from './line-break.pipe';
import { AutofocusDirective } from './input-autofocus';

@NgModule({
    imports: <any[]>[
        CommonModule
    ],
    declarations: <any[]>[
        SafePipe,
        TimePipe,
	    FileDialogComponent,
        StickyComponent,
        KalturaPlayerComponent,
        DatePipe,
        FileSizePipe,
        StickyNavDirective,
        LineBreakPipe,
        AutofocusDirective
    ],
    exports: <any[]>[
        TimePipe,
        SafePipe,
	    FileDialogComponent,
        StickyComponent,
        KalturaPlayerComponent,
        DatePipe,
        FileSizePipe,
        StickyNavDirective,
        LineBreakPipe,
        AutofocusDirective
    ],
    providers: <any[]>[
    ]
})
export class KalturaUIModule {}
