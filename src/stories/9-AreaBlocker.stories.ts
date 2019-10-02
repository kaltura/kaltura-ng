import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AreaBlockerMessage, AreaBlockerModule } from '@kaltura-ng/kaltura-ui';
import { action } from '@storybook/addon-actions';

storiesOf('AreaBlocker', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        AreaBlockerModule,
      ],
    })
  )
  .add('Default', () => ({
    template: `
        <k-area-blocker [showLoader]="true">
            <div style="width: 100%; height: 20em; background: white"></div>
        </k-area-blocker>
    `,
  }))
  .add('Message', () => ({
    template: `
        <k-area-blocker [message]="message">
            <div style="width: 100%; height: 20em; background: white"></div>
        </k-area-blocker>
    `,
    props: {
      message: new AreaBlockerMessage({
        title: 'Area blocker title',
        message: 'Area blocker message content',
        buttons: [
          {
            label: 'Some action button',
            action: () => action('Some action button event')()
          }
        ]
      })
    }
  }));
