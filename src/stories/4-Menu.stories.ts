import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { action } from '@storybook/addon-actions';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { KalturaPrimeNgUIModule } from '@kaltura-ng/kaltura-primeng-ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const items: MenuItem[] = [
  {
    label: 'Show Alert',
    command: (event) => action('Show Alert Action Executed')(event),
  },
  {
    label: 'Disabled',
    disabled: true,
  },
  {
    label: 'Add Item',
    icon: 'kIconplus',
    command: (event) => action('Add Item Action Executed')(event),
  },
  {
    separator: true,
  },
  {
    label: 'Delete item',
    styleClass: 'kDanger',
    command: (event) => action('Delete item Action Executed')(event),
  }
];

storiesOf('Menus', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        KalturaPrimeNgUIModule,
        ButtonModule,
        MenuModule,
      ],
    })
  )
  .add('Default', () => ({
    template: `
        <button pButton class="kButtonDefault more-btn" icon="kIconmore" (click)="menu.toggle($event)"></button>
        <p-menu #menu [popup]="true" [model]="items" [appendTo]="'body'" kMenuCloseOnScroll></p-menu>
    `,
    props: {
      items,
    }
  }));
