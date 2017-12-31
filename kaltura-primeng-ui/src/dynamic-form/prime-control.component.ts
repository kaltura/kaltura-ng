<<<<<<< HEAD
import {Component, Input} from '@angular/core';
=======
import {Component, Input, OnInit, OnDestroy} from '@angular/core';
>>>>>>> master
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

    public isValid = true;
    public errorMsg = '';


    ngOnInit() {
        this.form.statusChanges
            .cancelOnDestroy(this)
            .subscribe(() => {
                this.isValid = this.form.status === 'VALID';
                if (!this.isValid) {
                    this.errorMsg = this.getErrorMsg();
                }
                else{
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

    getErrorMsg(): string {
        let result = '';

        const formControl = this.form.controls[this.control.key];
        if (this.control.errors && !formControl.valid)
        {
            const firstErrorKey = Object.keys(this.control.errors).find( errorKey =>
                formControl.hasError(errorKey));

            if (firstErrorKey)
            {
                result = this.control.errors[firstErrorKey];
            }
        }

        return result || 'Invalid value';
    }
}
