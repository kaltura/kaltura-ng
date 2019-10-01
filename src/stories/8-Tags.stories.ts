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
    tooltip: 'First',
  },
  {
    value: 2,
    label: 'Second',
    tooltip: 'Second',
  },
  {
    value: 3,
    label: 'Third',
    tooltip: 'Third',
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
  .add('Default', () => ({
    template: `
        <kTags clearAllLabel="Clear All"
               title="Tags"
               [data]="items"
               [labelField]="'label'"
               [tooltipField]="'tooltip'"
               (onTagRemove)="onTagRemove($event)"
               (onRemoveAll)="onRemoveAll()"
               (onTagsChange)="onTagsChange($event)"></kTags>
        <button *ngIf="!items.length" pButton label="Reset" (click)="reset()"></button>
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
  }));
