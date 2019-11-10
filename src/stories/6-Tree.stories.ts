import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeModule } from 'primeng/tree';
import { action } from '@storybook/addon-actions';

const items = [
  {
    expanded: false,
    label: 'Group',
    children: [
      {
        label: 'First',
        value: '1',
      },
      {
        label: 'Second',
        value: '2',
      },
      {
        label: 'Third',
        value: '3',
      },
    ],
  },
  {
    expanded: true,
    label: 'Group 2',
    children: [
      {
        label: 'First',
        value: '1',
      },
      {
        label: 'Second',
        value: '2',
        selected: true,
      },
    ],
  },
];

storiesOf('Tree', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        TreeModule,
      ],
    })
  )
  .add(
    'Default',
    () => ({
      template: `
        <div style="padding: 1em; border-radius: 3px; background: white">
        <p-tree selectionMode="checkbox"
                [value]="items"
                [(selection)]="value"
                (onNodeSelect)="onNodeSelect($event)"
                (onNodeUnselect)="onNodeUnselect($event)"></p-tree>
        </div>
    `,
      props: {
        items,
        value: [],
        onNodeSelect: action('onNodeSelect'),
        onNodeUnselect: action('onNodeUnselect'),
      }
    }),
    {
      notes: {
        markdown: `
        The documentation for a primeng tree component can be found
        <a href="https://www.primefaces.org/primeng/#/tree" target="_blank">here</a>
        `,
      }
    }
  );
