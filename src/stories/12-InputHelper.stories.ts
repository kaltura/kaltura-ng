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
  .add(
    'Default',
    () => ({
      template: `
        <kInputHelper title="Helper tip title">
            Helper tip content
        </kInputHelper>
    `,
    }),
    {
      notes: {
        markdown: `
        Inputs:\n
        * \`title: string\`
        * \`trigger: 'click' | 'hover' = 'hover'\`
        * \`triggerIcon: string = 'kIconhelp_full'\`
        * \`icon: string = 'kIconhelp'\`
        * \`width: number = 300\`
        * \`placement: { x: PopupWidgetXPositions, y: PopupWidgetYPositions } = { x: 'right', y: 'top' }\`\n
        Custom Types:\n
          * \`type PopupWidgetXPositions = 'left' | 'right' | 'center'\`
          * \`type PopupWidgetYPositions = 'top' | 'bottom' | 'center'\`\n
        Usage example:\n
        \`\`\`
        <kInputHelper title="Helper tip title">
            Helper tip content
        </kInputHelper>
        \`\`\`
        `,
      }
    }
  )
  .add('Open on click', () => ({
    template: `
        <kInputHelper title="Helper tip title" trigger="click">
            Helper tip content
        </kInputHelper>
    `,
  }))
  .add('Custom icons', () => ({
    template: `
        <kInputHelper title="Helper tip title" triggerIcon="kIconrating" icon="kIconlife_donut">
            Helper tip content
        </kInputHelper>
    `,
  }));
