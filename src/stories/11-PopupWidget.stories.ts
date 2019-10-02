import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupWidgetModule } from '@kaltura-ng/kaltura-ui';
import { ButtonModule } from 'primeng/button';

storiesOf('PopupWidget', module)
  .addDecorator(story => {
    document.body.classList.add('kOverrideFAIcons');
    return story();
  })
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        PopupWidgetModule,
        ButtonModule,
      ],
    })
  )
  .add('Default', () => ({
    template: `
        <button pButton class="kButtonDefault" label="Open Modal" (click)="modal.open()"></button>
        <kPopupWidget #modal [popupWidth]="500" [popupHeight]="450" [modal]="true">
          <ng-template>
            <div style="padding: 5em;">
                Modal Content
            </div>
          </ng-template>
        </kPopupWidget>
    `,
  }))
  .add('Close Button inside', () => ({
    template: `
        <button pButton class="kButtonDefault" label="Open Modal" (click)="modal.open()"></button>
        <kPopupWidget #modal
                      [popupWidth]="500"
                      [popupHeight]="450"
                      [modal]="true"
                      [closeOnClickOutside]="false"
                      [closeBtnInside]="true"
                      [closeBtn]="false">
          <ng-template>
            <div style="padding: 5em;">
                <button class="kButtonDefault" pButton label="Close Modal" (click)="modal.close()"></button>
            </div>
          </ng-template>
        </kPopupWidget>
    `,
  }))
  .add('Fullscreen', () => ({
    template: `
        <button class="kButtonDefault" pButton label="Open Modal" (click)="modal.open()"></button>
        <kPopupWidget #modal
                      [fullScreen]="true"
                      [modal]="true"
                      [closeOnClickOutside]="false"
                      [closeBtnInside]="true"
                      [closeBtn]="false">
          <ng-template>
            <div style="height: 100vh; width: 100%; padding: 5em;">
                <button class="kButtonDefault" pButton label="Close Modal" (click)="modal.close()"></button>
            </div>
          </ng-template>
        </kPopupWidget>
    `,
  }))
  .add('Slider', () => ({
    template: `
        <button class="kButtonDefault" pButton label="Open Modal" (click)="modal.open()"></button>
        <kPopupWidget #modal [slider]="true" [popupWidth]="500">
          <ng-template>
            <div style="padding: 5em;">
                <button class="kButtonDefault" pButton label="Close Modal" (click)="modal.close()"></button>
            </div>
          </ng-template>
        </kPopupWidget>
    `,
  }))
  .add('Target', () => ({
    template: `
        <button #target class="kButtonDefault" pButton label="Open Modal"></button>
        <kPopupWidget #modal [popupWidth]="240" [closeBtn]="false" [targetRef]="target" [targetOffset]="{'x': 0, 'y': 40}">
          <ng-template>
            <div style="padding: 5em;">
                Modal Content
            </div>
          </ng-template>
        </kPopupWidget>
    `,
  }))
  .add('Transparent', () => ({
    template: `
        <button pButton class="kButtonDefault" label="Open Modal" (click)="modal.open()"></button>
        <kPopupWidget #modal [transparent]="true" [modal]="true" [popupWidth]="360" [popupHeight]="385" [closeBtn]="true">
          <ng-template>
            <div style="padding: 5em; color: white">
                No modal background
            </div>
          </ng-template>
        </kPopupWidget>
    `,
  }));
