import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AutoCompleteModule, SuggestionsProviderData } from '@kaltura-ng/kaltura-primeng-ui';
import { of, Subject } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { delay, map } from 'rxjs/operators';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { action } from '@storybook/addon-actions';
import { CalendarModule } from 'primeng/calendar';

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

storiesOf('Inputs', module)
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
        InputSwitchModule,
        AutoCompleteModule,
        RadioButtonModule,
        CheckboxModule,
        CalendarModule,
      ],
    })
  )
  .add('Default', () => ({
    styles: [styles],
    template: `
        <input type="text" pInputText placeholder="Enter text" [(ngModel)]="value">
        <span class="input-value">{{value}}</span>
    `,
    props: {
      value: '',
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
        <input type="text" [class.has-error]="!value" pInputText placeholder="Has error" [(ngModel)]="value">
        <span *ngIf="!value" class="input-value input-error">Error message</span>
    `,
    props: {
      value: '',
    }
  }))
  .add(
    'With Icon',
    () => ({
      styles: [styles],
      template: `
        <input type="text" class="search-text-input" pInputText placeholder="Search" [(ngModel)]="value">
        <span class="input-value">{{value}}</span>
    `,
      props: {
        value: '',
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
  .add('Autocomplete', () => ({
    styles: [styles],
    template: `
        <kAutoComplete [(ngModel)]="value"
                     suggestionLabelField="label"
                     field="label"
                     placeholder="First, Second, Third"
                     [multiple]="true"
                     [limitToSuggestions]="true"
                     [minLength]="3"
                     [tooltipResolver]="tooltipResolver"
                     [suggestionsProvider]="suggestions"
                     (completeMethod)="search($event)">
      </kAutoComplete>
    `,
    props: {
      value: '',
      tooltipResolver: (value: SelectItem) => `${value.label}: ${value.value}`,
      suggestions: suggestions,
      search: ({ query }) => {
        suggestions.next({ suggestions: [], isLoading: true });

        const searchTerm = (query || '').trim().toLowerCase();
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
          <p-radioButton name="radioButton" value="this" label="This" [(ngModel)]="value"></p-radioButton>
          <p-radioButton name="radioButton" value="that" label="That" [(ngModel)]="value"></p-radioButton>
          <p-radioButton name="radioButton" value="whatever" label="Disabled" [disabled]="true" [(ngModel)]="value"></p-radioButton>
        </div>
        <span class="input-value">{{value}}</span>
    `,
    props: {
      value: 'this',
    }
  }))
  .add('Checkbox', () => ({
    styles: [styles],
    template: `
        <div style="display: flex; width: 20em; justify-content: space-between">
          <p-checkbox label="First" name="checkbox" value="1" [(ngModel)]="value"></p-checkbox>
          <p-checkbox label="Second" name="checkbox" value="2" [(ngModel)]="value"></p-checkbox>
          <p-checkbox label="Third" name="checkbox" value="3" [(ngModel)]="value"></p-checkbox>
          <p-checkbox label="Disabled" name="checkbox" value="4" [disabled]="true" [(ngModel)]="value"></p-checkbox>
        </div>
        <span class="input-value">{{value}}</span>
    `,
    props: {
      value: null,
    }
  }))
  .add('Switch', () => ({
    styles: [styles],
    template: `
        <button pButton style="width: 6em; margin-bottom: 1em"
                [label]="disabled ? 'Enable' : 'Disable'"
                (click)="disabled = !disabled"></button>
        <p-inputSwitch [disabled]="disabled" [(ngModel)]="value"></p-inputSwitch>
        <span class="input-value">{{value}}</span>
    `,
    props: {
      value: false,
      disabled: false,
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
      onSelect: action('onCalendarSelect'),
    }
  }));
