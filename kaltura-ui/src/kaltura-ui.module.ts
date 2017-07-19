import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDialogComponent } from './components/file-dialog/file-dialog.component';
import { DatePipe } from './date.pipe';
import { SafePipe } from './safe.pipe';
import { TimePipe } from './time.pipe';
import { FileSizePipe } from './file-size.pipe';
import { StickyNavDirective } from './directives/sticky-nav.directive';

@NgModule({
    imports: <any[]>[
        CommonModule
    ],
    declarations: <any[]>[
        SafePipe,
        TimePipe,
	    FileDialogComponent,
        DatePipe,
        FileSizePipe,
        StickyNavDirective
    ],
    exports: <any[]>[
        TimePipe,
        SafePipe,
	    FileDialogComponent,
        DatePipe,
        FileSizePipe,
        StickyNavDirective
    ],
    providers: <any[]>[
    ]
})
export class KalturaUIModule {}
