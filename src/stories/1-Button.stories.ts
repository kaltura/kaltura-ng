import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { action } from '@storybook/addon-actions';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';

storiesOf('Button', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        ButtonModule,
        TooltipModule,
      ],
    })
  )
  .add('Default', () => ({
    template: `
      <button pButton class="kButtonDefault" label="Default" (click)="onClick($event)"></button>
    `,
    props: {
      onClick: action('click'),
    }
  }))
  .add('Branded', () => ({
    template: `
      <button pButton class="kButtonBranded" label="Branded" (click)="onClick($event)"></button>
    `,
    props: {
      onClick: action('click'),
    }
  }))
  .add('Danger', () => ({
    template: `
      <button pButton class="kButtonDanger" label="Danger" (click)="onClick($event)"></button>
    `,
    props: {
      onClick: action('click'),
    }
  }))
  .add('Disabled', () => ({
    template: `
      <button pButton class="kButtonDefault" label="Disabled" [disabled]="true" (click)="onClick($event)"></button>
    `,
    props: {
      onClick: action('click'),
    }
  }))
  .add('With Icon', () => ({
    template: `
      <button pButton class="kButtonDefault" label="With Icon" icon="kIconcalendar" iconPos="left"></button>
    `,
    props: {
      onClick: action('click'),
    }
  }))
  .add('Icon only', () => ({
    template: `
      <button pButton class="kButtonDanger" icon="kIcontrash" kTooltip="Delete" placement="right"
              [style.width.px]="34" (click)="onClick($event)"></button>
    `,
    props: {
      onClick: action('click'),
    }
  }))
  .add('Link', () => ({
    template: `
      <a href="#" class="link" (click)="onClick($event)">Link</a>
    `,
    props: {
      onClick: (e) => {
        e.preventDefault();
        action('click')(e);
      },
    }
  }));
