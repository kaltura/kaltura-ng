import {Component, Input} from '@angular/core';
import {FormGroup}        from '@angular/forms';
import {DynamicFormControlBase} from '@kaltura-ng/kaltura-ui/dynamic-form';

@Component({
    selector: 'k-prime-control',
    templateUrl: './prime-control.component.html',
    styleUrls: ['./prime-control.component.scss']
})
export class PrimeControl {
    @Input() control: DynamicFormControlBase<any>;
    @Input() form: FormGroup;

    get isValid() {
        return this.form.controls[this.control.key].valid;
    }

    getErrorMsg(): string {
        let error:string  = "";
        if(this.control.errors){
            const BreakException = {};
            try {
                Object.keys(this.control.errors).forEach(
                    key => {
                        if (this.form.hasError(key, [this.control.key])) {
                            error = this.control.errors[key];
                            throw  BreakException;
                        }

                    }
                )
            }
            catch (e) {
                if (e != BreakException) {
                    throw e;
                }
            }
        }

        return error;
    }
}
