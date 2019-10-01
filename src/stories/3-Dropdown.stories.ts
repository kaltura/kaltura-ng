import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { MultiSelectModule } from '@kaltura-ng/kaltura-primeng-ui';

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

storiesOf('Dropdowns', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        DropdownModule,
        MultiSelectModule,
      ],
    })
  )
  .add('Default', () => ({
    template: `<p-dropdown placeholder="Select an item"
                            [options]="options"
                            (onChange)="onChange($event)"
                            [(ngModel)]="selected"></p-dropdown>`,
    props: {
      options,
      selected: null,
      onChange: action('onChange'),
    }
  }))
  .add('With Filter', () => ({
    template: `<p-dropdown placeholder="Select an item"
                    filterBy="label,value.name"
                    [options]="options"
                    [filter]="true"
                    (onChange)="onChange($event)"
                    [(ngModel)]="selected"></p-dropdown>`,
    props: {
      options,
      selected: null,
      onChange: action('onChange'),
    }
  }))
  .add('Multiselect', () => ({
    template: `
      <kMultiSelect menuItemDisplayStyle="flex"
                    defaultLabel="Select Items"
                    allSelectedLabel="All Selected"
                    selectAllLabel="Select All"
                    [options]="options"
                    [showToggleAll]="true"
                    [maxSelectedLabels]="0"
                    [resetFilterOnHide]="true"
                    (onChange)="onChange($event)"
                    [(ngModel)]="selected"></kMultiSelect>
    `,
    props: {
      options,
      selected: null,
      onChange: action('onChange'),
    }
  }));
