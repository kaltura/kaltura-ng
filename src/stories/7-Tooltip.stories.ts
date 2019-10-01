import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';
import { InputTextModule } from 'primeng/inputtext';

storiesOf('Tooltip', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        TooltipModule,
        InputTextModule,
      ],
    })
  )
  .add('Default', () => ({
    template: `
        <div style="padding: 1.5em;">
            <span kTooltip="Example of a tooltip">Hover me</span>
        </div>
    `,
  }))
  .add('With markdown', () => ({
    template: `
        <div style="padding: 1.5em;">
            <span kTooltip="<i>Example</i> of a <b>tooltip</b>" [escape]="false">Hover me</span>
        </div>
    `,
  }))
  .add('Placement', () => ({
    template: `
        <div style="padding: 1.5em; display: flex; width: 15em; justify-content: space-between;">
            <span kTooltip="Appeared top" placement="top">Top</span>
            <span kTooltip="Appeared right" placement="right">Right</span>
            <span kTooltip="Appeared bottom" placement="bottom">Bottom</span>
            <span kTooltip="Appeared left" placement="left">Left</span>
        </div>
    `,
  }))
  .add('Show on ellipsis', () => ({
    template: `
        <div style="padding: 1.5em;">
            <span style="overflow: hidden; text-overflow: ellipsis; display: inline-block; white-space: nowrap;"
                  [style.width.em]="width"
                  kTooltip="Appeared when text is cut"
                  [showOnEllipsis]="true">Some long text that doesn't fit</span>
            <div style="margin-top: 1em;">
                <input pInputText [(ngModel)]="width" type="number">
            </div>
        </div>
    `,
    props: {
      width: 10,
    }
  }));
