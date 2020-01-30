import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CopyToClipboardModule } from '@kaltura-ng/mc-shared';

storiesOf('CopyToClipboard', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        CopyToClipboardModule,
      ],
    })
  )
  .add(
    'Default',
    () => ({
      template: `
        <div style="display: flex; align-items: center; padding: 1.5em 2.5em;">
            <kCopyToClipboard [text]="text"></kCopyToClipboard>
            <span style="margin-left: 1em;">{{text}}</span>
        </div>
    `,
      props: {
        text: 'This text will be copied to the clipboard'
      }
    }),
    {
      notes: {
        markdown: `
        Inputs:\n
        * \`text: string\`\n
        Usage example:\n
        \`\`\`
        <kCopyToClipboard [text]="text"></kCopyToClipboard>
        \`\`\`
        `,
      }
    }
  );
