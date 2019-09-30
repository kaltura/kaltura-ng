import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
      ],
    })
  )
  .add('Default', () => ({
    template: `<p-dropdown placeholder="Select an item" [options]="options" [(ngModel)]="selected"></p-dropdown>`,
    props: {
      options,
      selected: null,
    }
  }))
  .add('With Filter', () => ({
    template: `<p-dropdown placeholder="Select an item"
                    filterBy="label,value.name"
                    [options]="options"
                    [filter]="true"
                    [(ngModel)]="selected"></p-dropdown>`,
    props: {
      options,
      selected: null,
    }
  }));
