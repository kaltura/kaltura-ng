import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDialogComponent } from './components/file-dialog/file-dialog.component';
import { DatePipe } from './date.pipe';
import { SafePipe } from './safe.pipe';
import { TimePipe } from './time.pipe';
import { FileSizePipe } from './file-size.pipe';
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
        DatePipe,
        FileSizePipe,
        LineBreakPipe,
        AutofocusDirective
    ],
    exports: <any[]>[
        TimePipe,
        SafePipe,
	    FileDialogComponent,
        DatePipe,
        FileSizePipe,
        LineBreakPipe,
        AutofocusDirective
    ],
    providers: <any[]>[
    ]
})
export class KalturaUIModule {}
