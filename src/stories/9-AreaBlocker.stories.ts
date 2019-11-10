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
  .add(
    'Default',
    () => ({
      template: `
        <k-area-blocker [showLoader]="true">
            <div style="width: 100%; height: 20em; background: white"></div>
        </k-area-blocker>
    `,
    }),
    {
      notes: {
        markdown: `
        Inputs:\n
        * \`bodyScroll: boolean = false\`
        * \`spinnerMarginTop: number = 0\`
        * \`classes: string\`
        * \`showLoader: boolean\`
        * \`message: string | AreaBlockerMessage\`\n
        CustomTypes:\n
        * \`interface AreaBlockerMessage { title: string; message: string; buttons: AreaBlockerMessageButton[] }\`
        * \`interface AreaBlockerMessageButton { label: string; action: () => void; classes?: string }\`\n
        Usage example:\n
        \`\`\`
        <k-area-blocker [showLoader]="isLoading" [message]="errorMessage">
            Content
        </k-area-blocker>
        \`\`\`
        `
      }
    }
  )
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
            classes: 'kButtonDefault',
            action: () => action('Some action button event')()
          }
        ]
      })
    }
  }));
