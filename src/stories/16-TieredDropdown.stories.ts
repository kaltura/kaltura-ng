import {moduleMetadata, storiesOf} from '@storybook/angular';
import {CommonModule} from '@angular/common';
import {SelectItem} from 'primeng/api';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {action} from '@storybook/addon-actions';
import {TieredDropdownModule} from '../../projects/kaltura-ng/kaltura-primeng-ui/src/lib/tiered-dropdown/tiered-dropdown.module';
import {ButtonModule} from 'primeng/button';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {SharedModule} from 'primeng/components/common/shared';

const options: any[] = [
  {
    label: 'First',
    value: 1,
    icon: 'kIconsmiley'
  },
  {
    label: 'Second',
    value: 2,
    icon: 'kIconsmiley'
  },
  {
    label: 'Third',
    icon: 'kIconsmiley',
    items: [
      {
        label: 'Third.First',
        value: 3.5,
        icon: 'kIconsmiley'
      },
      {
        label: 'Third.Second',
        value: 3.2,
        icon: 'kIconsmiley'
      },
    ]
  },
  {
    label: 'Onother one',
    value: 4,
    icon: 'kIconsmiley'
  },
  {
    label: 'Disabled',
    value: 5,
    disabled: true,
    icon: 'kIconsmiley'
  }
];

storiesOf('Tiered Dropdown', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        SharedModule,
        TieredDropdownModule,
      ],
    })
  )
  .add(
    'Default',
    () => ({
      template: `<kTieredDropdown placeholder="Select an item" [items]="options" [placeholder]="'Select Something'"
                            [(ngModel)]="selected" (onChange)="onChange($event)">
                </kTieredDropdown>`,
      props: {
        options,
        selected: null,
        onChange: action('onChange'),
      }
    }),
    {
      notes: {
        markdown: `
        The documentation for a primeng dropdown component can be found
        <a href="https://www.primefaces.org/primeng/#/dropdown" target="_blank">here</a>
        `,
      }
    }
  );

