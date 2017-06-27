import { Output, EventEmitter, Component, ElementRef, Input, OnInit, HostListener } from '@angular/core';

@Component({
	selector: 'kFileDialog',
	templateUrl: './file-dialog.component.html',
	styleUrls: ['./file-dialog.component.scss']
})
export class FileDialogComponent implements OnInit {

	@Input() filter: string = "";
	@Input() allowMultiple: boolean = false;

	@Output() onFileSelected = new EventEmitter<File[]>();

	constructor(private elementRef: ElementRef) {

	}

	public open(event? : Event) {

		if (event)
		{
			event.stopPropagation();
			event.preventDefault();
		}
		this.elementRef.nativeElement.firstChild.value = "";
		this.elementRef.nativeElement.firstChild.click();
	}

	public _fileInputChange(event){
		if (event.currentTarget.files && event.currentTarget.files.length)
		{
			this.onFileSelected.emit(event.currentTarget.files);
		}
	}

	ngOnInit() {

	}
}

