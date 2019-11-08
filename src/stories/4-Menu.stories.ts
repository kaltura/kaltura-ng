import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { action } from '@storybook/addon-actions';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { KalturaPrimeNgUIModule } from '@kaltura-ng/kaltura-primeng-ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TieredMenuModule } from 'primeng/tieredmenu';

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

const nestedItems = [
  {
    label: 'Level 1',
    items: [
      {
        label: 'Level 2',
        command: (event) => action('Level 2 Action Executed')(event),
      },
    ]
  },
  {
    label: 'Some item',
    command: (event) => action('Some item Action Executed')(event),
  },
];

storiesOf('Menu', module)
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
        TieredMenuModule,
      ],
    })
  )
  .add(
    'Default',
    () => ({
      template: `
        <button pButton class="kButtonDefault" icon="kIconmore" (click)="menu.toggle($event)"></button>
        <p-menu #menu [popup]="true" [model]="items" [appendTo]="'body'" (onShow)="onShow($event)" (onHide)="onHide($event)"></p-menu>
    `,
      props: {
        items,
        onShow: action('onShow'),
        onHide: action('onHide'),
      }
    }),
    {
      notes: {
        markdown: `
        The documentation for a primeng menu component can be found
        <a href="https://www.primefaces.org/primeng/#/menu" target="_blank">here</a>
        `,
      }
    }
  )
  .add('Nested', () => ({
    template: `
        <button pButton class="kButtonDefault" icon="kIconmore" (click)="menu.toggle($event)"></button>
        <p-tieredMenu #menu [popup]="true" [model]="items" [appendTo]="'body'"
                      (onShow)="onShow($event)" (onHide)="onHide($event)"></p-tieredMenu>
    `,
    props: {
      items: nestedItems,
      onShow: action('onShow'),
      onHide: action('onHide'),
    }
  }))
  .add(
    'Auto-close upon scrolling',
    () => ({
      template: `
        <div style="padding-top: 5em; min-height: calc(100vh + 100px)">
            <button pButton class="kButtonDefault" label="Toggle Menu" (click)="menu.toggle($event)"></button>
            <p-menu #menu kMenuCloseOnScroll
                    [popup]="true"
                    [model]="items"
                    [appendTo]="'body'"
                    (onShow)="onShow($event)"
                    (onHide)="onHide($event)"></p-menu>
        </div>
    `,
      props: {
        items,
        onShow: action('onShow'),
        onHide: action('onHide'),
      }
    }),
    {
      notes: {
        markdown: `
          In order to add auto-close ability for a menu:

          1. Import \`KalturaPrimeNgUIModule\` from \`@kaltura-ng/kaltura-primeng-ui\`
          2. Add \`kMenuCloseOnScroll\` directive to \`p-menu\` element on a page
        `
      }
    }
  );
