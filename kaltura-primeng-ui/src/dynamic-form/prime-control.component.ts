import { Component, Input } from '@angular/core';
import { FormGroup }        from '@angular/forms';
import { DynamicFormControlBase } from '@kaltura-ng/kaltura-ui/dynamic-form';

@Component({
    selector: 'k-prime-control',
    templateUrl: './prime-control.component.html',
    styleUrls : ['./prime-control.component.scss']
})
export class PrimeControl {
    @Input() control: DynamicFormControlBase<any>;
    @Input() form: FormGroup;
    get isValid() {
        return this.form.controls[this.control.key].valid;
    }
}
