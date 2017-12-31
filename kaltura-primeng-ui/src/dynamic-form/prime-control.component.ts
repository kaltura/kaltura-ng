import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {FormGroup}        from '@angular/forms';
import {DynamicFormControlBase} from '@kaltura-ng/kaltura-ui/dynamic-form';

@Component({
    selector: 'k-prime-control',
    templateUrl: './prime-control.component.html',
    styleUrls: ['./prime-control.component.scss']
})
export class PrimeControl implements OnInit, OnDestroy {
    @Input() control: DynamicFormControlBase<any>;
    @Input() form: FormGroup;

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
        if (!this.isValid) {

        }
        else {
            this.errorMsg = '';
        }
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
