import { Component, Input, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import {FormGroup}        from '@angular/forms';
import {DynamicFormControlBase} from '@kaltura-ng/kaltura-ui/dynamic-form';
import { Calendar, Dropdown } from 'primeng/primeng';
import { MultiSelectComponent } from '../multi-select';
import { CalendarComponent } from '../calendar';

@Component({
    selector: 'k-prime-control',
    templateUrl: './prime-control.component.html',
    styleUrls: ['./prime-control.component.scss']
})
export class PrimeControl implements OnInit, OnDestroy {
    @Input() control: DynamicFormControlBase<any>;
    @Input() form: FormGroup;
    @Input() hideOnScroll = true; // hide Dropdown and CalendarComponent on scroll
    
    @ViewChild(Dropdown) _dropdown: Dropdown;
    @ViewChild(MultiSelectComponent) _multiSelect: MultiSelectComponent;
    @ViewChild(CalendarComponent) _calendar: CalendarComponent;
    
    @HostListener('window:scroll') _hideOnScroll(): void {
        if (!this.hideOnScroll) {
            return;
        }

        if (this._dropdown) {
            this._dropdown.hide();
        } else if (this._multiSelect) {
            this._multiSelect.hide();
        } else if (this._calendar) {
          this._calendar.hideOverlay();
        }
    }

    public errorMsg = '';

    get isValid() {
        return this.form.controls[this.control.key].valid;
    }

    ngOnInit() {
        if (!this.isValid) {
            this.errorMsg = this.getErrorMsg();
        }
        else {
            this.errorMsg = '';
        }

        this.onFormStatusChanges();

    }

    private onFormStatusChanges(): void {
        this.form.statusChanges
            .cancelOnDestroy(this)
            .subscribe(() => {
                if (!this.isValid) {
                    this.errorMsg = this.getErrorMsg();
                }
                else {
                    this.errorMsg = '';
                }
            });
    }

    private getErrorMsg(): string {
        let result = "";
        const formControl = this.form.controls[this.control.key];
        if (this.control.errors && !formControl.valid) {
            const firstErrorKey = Object.keys(this.control.errors).find(errorKey =>
                formControl.hasError(errorKey));

            if (firstErrorKey) {
                result = this.control.errors[firstErrorKey];
            }
        }
        return result;
    }

    ngOnDestroy() {

    }
}
