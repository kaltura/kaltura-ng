import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetailsBarModule } from '@kaltura-ng/kaltura-ui';
import { action } from '@storybook/addon-actions';

const data = {
  id: 'TestID',
  name: 'Test',
  icon: 'kIconsmiley',
  email: 'test@test.com',
};

storiesOf('DetailsBar', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        DetailsBarModule,
      ],
    })
  )
  .add(
    'Default',
    () => ({
      template: `
        <div style="padding-top: 1.5em;">
          <k-details-bar #detailsBar [data]="data">
            <kDetailInfo label="ID:" valueField="id"></kDetailInfo>
            <kDetailInfo label="Name:" valueField="name"></kDetailInfo>
            <kDetailInfo [iconStyle]="data.icon" tooltip="Tooltip Content"></kDetailInfo>
            <kDetailInfo label="Email:" valueField="email" (itemClick)="itemClick($event)"></kDetailInfo>
          </k-details-bar>
        </div>
    `,
      props: {
        data,
        itemClick: action('itemClick'),
      }
    }),
    {
      notes: {
        markdown: `
        Inputs:\n
        * \`basicDetailsLabel: string = 'Basic Details'\`
        * \`moreDetailsLabel: string = 'More Details'\`
        * \`data: any\`\n
        kDetailInfo component Inputs:\n
        * \`label: string\`
        * \`value: string\`
        * \`valueField: string\`
        * \`link: string\`
        * \`tooltip: string\`
        * \`toolTipAsHTML: boolean = true\`
        * \`iconStyle: string\`
        * \`separator: string = '|'\`
        * \`maxItemWidth: number = 300\`
        * \`isLastItem: boolean = false\`\n
        kDetailInfo component Outputs:\n
        * \`itemClick: EventEmitter<MouseEvent>\`\n
        Usage example:\n
        \`\`\`
        <k-details-bar #detailsBar [data]="data">
            <kDetailInfo label="ID:" valueField="id"></kDetailInfo>
            <kDetailInfo label="Name:" valueField="name"></kDetailInfo>
            <kDetailInfo [iconStyle]="data.icon" tooltip="Tooltip Content"></kDetailInfo>
            <kDetailInfo label="Email:" valueField="email" (itemClick)="itemClick($event)"></kDetailInfo>
        </k-details-bar>
        \`\`\`
        `,
      }
    });
