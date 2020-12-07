import {AbstractControl, ValidationErrors} from "@angular/forms";

// accepts http/https/ftp
export const urlRegex = new RegExp("(ftp|https?):\\/\\/(www\\.)?[-a-zA-Z0-9^@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9^@:%_\\+.~#?&//=]*)","i");

// accepts http/https
export  const urlHttpRegex = new RegExp("(https?):\\/\\/(www\\.)?[-a-zA-Z0-9^@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9^@:%_\\+.~#?&//=]*)","i");
export const ipRegex = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$","i");
/**
 * Provides a set of validators used by form controls.
 *
 * A validator is a function that processes a {@link FormControl} or collection of
 * controls and returns a map of errors. A null map means that validation has passed.
 *
 * ### Example
 *
 * ```typescript
 * var loginControl = new FormControl("", [Validators.ip, Validators.required])
 * ```
 *
 */
export class KalturaValidators {

    /**
     * Validator that requires controls to have a value represented as IP (value not required).
     */
    static ip(control: AbstractControl): ValidationErrors|null {
        if (!control.value || !control.value.length) return null;
        return ipRegex.test(control.value) ? null : {'ip': true};
    }

    /**
     * Validator that requires controls to have a value represented as URL (value not required).
     */
    static url(control: AbstractControl): ValidationErrors|null {
        if (!control.value || !control.value.length) return null;
        return urlRegex.test(control.value) ? null : {'url': true};
    }

    /**
     * Validator that requires controls to have a value represented as URL (value not required).
     */
    static urlHttp(control: AbstractControl): ValidationErrors|null {
        if (!control.value || !control.value.length) return null;
        return urlHttpRegex.test(control.value) ? null : {'url': true};
    }


    /**
     * Url validation
     */
    static isUrlValid(url: string): boolean {
        return urlRegex.test(url);
    }

}
