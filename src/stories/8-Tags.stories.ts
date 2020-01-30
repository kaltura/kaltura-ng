import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { TagsModule } from '@kaltura-ng/kaltura-ui';
import { ButtonModule } from 'primeng/button';

const data = [
  {
    value: 1,
    label: 'First',
    tooltip: '1st',
  },
  {
    value: 2,
    label: 'Second',
    tooltip: '2nd',
  },
  {
    value: 3,
    label: 'Third',
    tooltip: '3rd',
  },
  {
    value: 4,
    label: 'Fourth',
    tooltip: '4th',
  },
  {
    value: 5,
    label: 'Fifth',
    tooltip: '5th',
  },
  {
    value: 6,
    label: 'Sixth',
    tooltip: '6th',
  },
  {
    value: 7,
    label: 'Seventh',
    tooltip: '7th',
  },
  {
    value: 8,
    label: 'Eighth',
    tooltip: '8th',
  },
  {
    value: 9,
    label: 'Ninth',
    tooltip: '9th',
  },
];

const items = [...data];

storiesOf('Tags', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        TagsModule,
        ButtonModule,
      ],
    })
  )
  .add(
    'Default',
    () => ({
      template: `
        <kTags clearAllLabel="Clear All"
               title="Tags"
               [data]="items"
               [labelField]="'label'"
               [tooltipField]="'tooltip'"
               (onTagRemove)="onTagRemove($event)"
               (onRemoveAll)="onRemoveAll()"
               (onTagsChange)="onTagsChange($event)"></kTags>
        <button *ngIf="!items.length" class="kButtonDefault" pButton label="Reset" (click)="reset()"></button>
    `,
      props: {
        items,
        onTagRemove: e => {
          items.splice(items.indexOf(e), 1);
          action('onTagRemove')(e);
        },
        onRemoveAll: () => {
          (new Array(items.length)).fill(0).forEach(() => items.pop());
          action('onRemoveAll')();
        },
        reset: () => {
          data.forEach(item => items.push(item));
        },
        onTagsChange: e => action('onTagsChange')(e),
      }
    }),
    {
      notes: {
        markdown: `
        Inputs:\n
        * \`data: any[]\`
        * \`disabled: boolean = false\`
        * \`labelField: string\`
        * \`tooltipField: string\`
        * \`disabledField: string\`
        * \`removableTags: boolean = true\`
        * \`showClear: boolean = true\`
        * \`title: string\`
        * \`clearAllLabel: string = 'Clear All'\`\n
        Outputs:\n
        * \`onTagRemove: EventEmitter<any>\`
        * \`onRemoveAll: EventEmitter<void>\`
        * \`onTagsChange: EventEmitter<{ tagsCount: number }>\`\n
        Usage example:\n
        \`\`\`
        <kTags title="Tags"
               [data]="items"
               [labelField]="'label'"
               [tooltipField]="'tooltip'"
               (onTagRemove)="onTagRemove($event)"
               (onRemoveAll)="onRemoveAll()"
               (onTagsChange)="onTagsChange($event)"></kTags>
        \`\`\`
        `,
      }
    }
  );
