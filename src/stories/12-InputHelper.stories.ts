import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputHelperModule } from '@kaltura-ng/kaltura-ui';

storiesOf('InputHelper', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        InputHelperModule,
      ],
    })
  )
  .add('Default', () => ({
    template: `
        <kInputHelper title="Helper tip content">
            Helper content
        </kInputHelper>
    `,
  }))
  .add('Open on click', () => ({
    template: `
        <kInputHelper title="Helper tip content" trigger="click">
            Helper content
        </kInputHelper>
    `,
  }))
  .add('Custom icons', () => ({
    template: `
        <kInputHelper title="Helper tip content" triggerIcon="kIconrating" icon="kIconlife_donut">
            Helper content
        </kInputHelper>
    `,
  }));
