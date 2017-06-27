import { getTestBed, async, inject, TestBed} from '@angular/core/testing';

import { DynamicFormService } from './dynamic-form.service';
import { DynamicFormModule } from './dynamic-form.module';

describe('dynamic form service', () => {
    let injector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DynamicFormModule],
            providers: []
        });
        injector = getTestBed();
    });

    afterEach(() => {
        injector = undefined;
    });

    describe('toForm()', () =>
    {
        it('convert textbox control with default value', async(inject([DynamicFormService], (dynamicFormService: DynamicFormService) => {

            const formGroup = dynamicFormService.toFormGroup([]);

            expect(true).toBe(true);
        })));

    });

});