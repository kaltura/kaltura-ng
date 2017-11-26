import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDialogComponent } from './components/file-dialog/file-dialog.component';
import { KalturaPlayerComponent } from './player/player.component';
import { DatePipe } from './date.pipe';
import { SafePipe } from './safe.pipe';
import { TimePipe } from './time.pipe';
import { FileSizePipe } from './file-size.pipe';
import { LineBreakPipe } from './line-break.pipe';
import { AutofocusDirective } from './input-autofocus';
import { ScrollToTopContainerComponent } from './components/scroll-to-top-container.component';

@NgModule({
    imports: <any[]>[
        CommonModule
    ],
    declarations: <any[]>[
        SafePipe,
        TimePipe,
	    FileDialogComponent,
        KalturaPlayerComponent,
        DatePipe,
        FileSizePipe,
        LineBreakPipe,
        AutofocusDirective,
        ScrollToTopContainerComponent,
    ],
    exports: <any[]>[
        TimePipe,
        SafePipe,
	    FileDialogComponent,
        KalturaPlayerComponent,
        DatePipe,
        FileSizePipe,
        LineBreakPipe,
        AutofocusDirective,
        ScrollToTopContainerComponent,
    ],
    providers: <any[]>[
    ]
})
export class KalturaUIModule {}
