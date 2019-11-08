import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { action } from '@storybook/addon-actions';

@Component({
  selector: 'app-confirm-dialog',
  template: `
      <button pButton class="kButtonDefault" label="Confirm" (click)="confirm()"></button>
      <p-confirmDialog header="Confirmation" width="500" key="confirm" [closeOnEscape]="false"></p-confirmDialog>
  `,
})
class ConfirmDialogContainerComponent {
  constructor(private confirmationService: ConfirmationService) {
  }

  public confirm(): void {
    this.confirmationService.confirm({
      key: 'confirm',
      message: 'Are you sure that you want to perform this action?',
      accept: () => action('accept')(),
      reject: () => action('reject')(),
    });
  }
}

@Component({
  selector: 'app-alert-dialog',
  template: `
      <button pButton class="kButtonDefault" label="Alert" (click)="alert()"></button>
      <p-confirmDialog header="Alert" width="500" key="alert" [closeOnEscape]="false"></p-confirmDialog>
  `,
})
class AlertDialogContainerComponent {
  constructor(private confirmationService: ConfirmationService) {
  }

  public alert(): void {
    this.confirmationService.confirm({
      key: 'alert',
      message: 'Some action happened!',
      rejectVisible: false,
      acceptLabel: 'OK',
      accept: () => action('accept')(),
    });
  }
}

storiesOf('ConfirmDialog', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        ConfirmDialogModule,
        ButtonModule,
      ],
      declarations: [
        ConfirmDialogContainerComponent,
        AlertDialogContainerComponent
      ],
      providers: [
        ConfirmationService,
      ],
    })
  )
  .add(
    'Default',
    () => ({ template: '<app-confirm-dialog></app-confirm-dialog>' }),
    {
      notes: {
        markdown: `
        The documentation for a primeng confirmdialog component can be found
        <a href="https://www.primefaces.org/primeng/#/confirmdialog" target="_blank">here</a>
        `,
      }
    }
  )
  .add('Alert', () => ({ template: '<app-alert-dialog></app-alert-dialog>' }));
