import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import {
  AutoCompleteModule,
  ClearableInputModule,
  SliderModule,
  SuggestionsProviderData,
  TimeSpinnerModule
} from '@kaltura-ng/kaltura-primeng-ui';
import { of, Subject } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { delay, map } from 'rxjs/operators';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { action } from '@storybook/addon-actions';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KalturaUIModule } from '@kaltura-ng/kaltura-ui';

const styles = `:host { display: flex; flex-direction: column; }`;
const suggestions = new Subject<SuggestionsProviderData>();
const options: SelectItem[] = [
  {
    label: 'First',
    value: 1,
  },
  {
    label: 'Second',
    value: 2,
  },
  {
    label: 'Second and a half',
    value: 2.5,
  },
  {
    label: 'Third',
    value: 3,
  },
  {
    label: 'Disabled',
    value: 4,
    disabled: true,
  }
];

storiesOf('Input', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        InputSwitchModule,
        AutoCompleteModule,
        RadioButtonModule,
        CheckboxModule,
        CalendarModule,
        ClearableInputModule,
        KalturaUIModule,
        SliderModule,
        TimeSpinnerModule,
      ],
    })
  )
  .add('Default', () => ({
    styles: [styles],
    template: `
        <input type="text" pInputText placeholder="Enter text" (input)="onChange($event)" [(ngModel)]="value">
        <span class="input-value">{{value}}</span>
    `,
    props: {
      value: '',
      onChange: action('input'),
    }
  }))
  .add('Disabled', () => ({
    styles: [styles],
    template: `
        <input type="text" pInputText placeholder="Disabled" [disabled]="true">
    `,
  }))
  .add('With Error', () => ({
    styles: [styles],
    template: `
        <input type="text" pInputText placeholder="Has error"
               [class.has-error]="!value"
               (input)="onChange($event)"
               [(ngModel)]="value">
        <span *ngIf="!value" class="input-value input-error">Error message</span>
    `,
    props: {
      value: '',
      onChange: action('input'),
    }
  }))
  .add(
    'With Icon',
    () => ({
      styles: [styles],
      template: `
        <input type="text" class="search-text-input" pInputText placeholder="Search"
               (input)="onChange($event)"
               [(ngModel)]="value">
        <span class="input-value">{{value}}</span>
    `,
      props: {
        value: '',
        onChange: action('input'),
      }
    }),
    {
      notes: {
        markdown: `
          There's no special property for icon. Just add a style class to an input which has icon as a background.

          For example: \` .search-text-input { background: url('data:image/png;base64,...); padding-left: 2.375em; }\`
        `
      }
    }
  )
  .add('Clearable input', () => ({
    styles: [styles],
    template: `
        <kClearableInput placeholder="Enter text & press enter"
                          (onEnterKeyup)="onEnterKeyup($event)"
                          (onClear)="onClear($event)"></kClearableInput>
    `,
    props: {
      value: '',
      onEnterKeyup: action('onEnterKeyup'),
      onClear: action('onClear'),
    }
  }))
  .add(
    'Textarea',
    () => ({
      styles: [styles],
      template: `
        <textarea pInputTextarea placeholder="Enter text"
                  [style.height.em]="9"
                  [rows]="6"
                  [cols]="60"
                  (input)="onChange($event)"
                  [(ngModel)]="value"></textarea>
        <span class="input-value">{{value}}</span>
    `,
      props: {
        value: '',
        onChange: action('input'),
      }
    }),
    {
      notes: {
        markdown: 'In addition to `rows` property use `height` style-property to style `textarea` height'
      }
    }
  )
  .add('Autocomplete', () => ({
    styles: [styles],
    template: `
        <div style="margin-top: 1em;">
            <kAutoComplete suggestionLabelField="label"
                     field="label"
                     placeholder="First, Second, Third"
                     [multiple]="true"
                     [limitToSuggestions]="true"
                     [minLength]="3"
                     [tooltipResolver]="tooltipResolver"
                     [suggestionsProvider]="suggestions"
                     (completeMethod)="search($event)"
                     [(ngModel)]="value"></kAutoComplete>
        </div>
    `,
    props: {
      value: '',
      tooltipResolver: (value: SelectItem) => `${value.label}: ${value.value}`,
      suggestions: suggestions,
      search: (event) => {
        action('completeMethod')(event);

        suggestions.next({ suggestions: [], isLoading: true });

        const searchTerm = (event.query || '').trim().toLowerCase();
        of(options.filter(item => item.label.toLowerCase().startsWith(searchTerm) && !item.disabled))
          .pipe(
            map(result => ({ suggestions: result, isLoading: false })),
            delay(500),
          )
          .subscribe(result => {
            suggestions.next(result);
          });
      }
    }
  }))
  .add('Radio-button', () => ({
    styles: [styles],
    template: `
        <div style="display: flex; width: 15em; justify-content: space-between">
          <p-radioButton name="radioButton" value="this" label="This" (change)="onChange($event)" [(ngModel)]="value"></p-radioButton>
          <p-radioButton name="radioButton" value="that" label="That" (change)="onChange($event)" [(ngModel)]="value"></p-radioButton>
          <p-radioButton name="radioButton" value="whatever" label="Disabled" [disabled]="true" [(ngModel)]="value"></p-radioButton>
        </div>
        <span class="input-value">{{value}}</span>
    `,
    props: {
      value: 'this',
      onChange: action('change'),
    }
  }))
  .add('Checkbox', () => ({
    styles: [styles],
    template: `
        <div style="display: flex; width: 20em; justify-content: space-between">
          <p-checkbox label="First" name="checkbox" value="1" (onChange)="onChange($event)" [(ngModel)]="value"></p-checkbox>
          <p-checkbox label="Second" name="checkbox" value="2" (onChange)="onChange($event)" [(ngModel)]="value"></p-checkbox>
          <p-checkbox label="Third" name="checkbox" value="3" (onChange)="onChange($event)" [(ngModel)]="value"></p-checkbox>
          <p-checkbox label="Disabled" name="checkbox" value="4" [disabled]="true" [(ngModel)]="value"></p-checkbox>
        </div>
        <span class="input-value">{{value}}</span>
    `,
    props: {
      value: null,
      onChange: action('onChange'),
    }
  }))
  .add('Switch', () => ({
    styles: [styles],
    template: `
        <button pButton class="kButtonDefault" style="width: 6em; margin-bottom: 1em"
                [label]="disabled ? 'Enable' : 'Disable'"
                (click)="disabled = !disabled"></button>
        <p-inputSwitch [disabled]="disabled" (onChange)="onChange($event)" [(ngModel)]="value"></p-inputSwitch>
        <span class="input-value">{{value}}</span>
    `,
    props: {
      value: false,
      disabled: false,
      onChange: action('onChange'),
    }
  }))
  .add('Calendar', () => ({
    styles: [styles],
    template: `
        <p-calendar class="fix-calendar-input"
                    icon="kIconcalendar"
                    yearRange="2005:2050"
                    [showIcon]="true"
                    [monthNavigator]="true"
                    [yearNavigator]="true"
                    [(ngModel)]="value"
                    (onSelect)="onSelect($event)"></p-calendar>
        <span class="input-value">{{value}}</span>
    `,
    props: {
      value: null,
      onSelect: action('onSelect'),
    }
  }))
  .add(
    'File-input',
    () => ({
      styles: [styles],
      template: `
        <kFileDialog #fileDialog
                    [allowMultiple]="allowMultiple"
                    [filter]="filter ? '.png' : ''"
                    (onFileSelected)="onFileSelected($event)"></kFileDialog>
        <div style="display: flex; align-items: center">
            <button pButton style="margin-right: 1em;" class="kButtonDefault" label="Browse files"
                    (click)="fileDialog.open($event)"></button>
            <p-checkbox label="Allow only png files" [binary]="true" [(ngModel)]="filter"></p-checkbox>
            <div style="width: 1em"></div>
            <p-checkbox label="Allow multiple" [binary]="true" [(ngModel)]="allowMultiple"></p-checkbox>
        </div>
    `,
      props: {
        filter: false,
        allowMultiple: false,
        onFileSelected: action('onFileSelected'),
      }
    }),
    {
      notes: {
        markdown: `
          The component is not visible on the page.
          You should use \`open($event)\` method of the component in order to open file dialog.
        `
      }
    }
  )
  .add('Slider-input', () => ({
    styles: [styles],
    template: `
        <div style="padding-top: 1.5em">
            <kSlider [min]="1" [max]="200" [step]="1" (onChange)="onChange($event)" [(ngModel)]="value"></kSlider>
            <span class="input-value">{{value}}</span>
        </div>
    `,
    props: {
      value: 200,
      onChange: action('onChange'),
    }
  }))
  .add('Timespinner-input', () => ({
    styles: [styles],
    template: `
        <kTimeSpinner (onChange)="onChange($event)" [(ngModel)]="value"></kTimeSpinner>
        <span class="input-value">{{value}} Seconds</span>
    `,
    props: {
      value: 0,
      onChange: action('onChange'),
    }
  }));
