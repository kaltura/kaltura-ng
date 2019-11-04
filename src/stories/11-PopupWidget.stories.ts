import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupWidgetModule } from '@kaltura-ng/kaltura-ui';
import { ButtonModule } from 'primeng/button';
import { action } from '@storybook/addon-actions';

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
  .add(
    'Default',
    () => ({
      template: `
        <button pButton class="kButtonDefault" label="Open Modal" (click)="modal.open()"></button>
        <kPopupWidget #modal
                      [popupWidth]="300"
                      [popupHeight]="300"
                      [modal]="true"
                      (onOpen)="onOpen($event)"
                      (onClose)="onClose($event)">
          <ng-template>
            <div class="modal-container" [style.height.px]="300">
                Modal Content
            </div>
          </ng-template>
        </kPopupWidget>
    `,
      props: {
        onOpen: action('onOpen'),
        onClose: action('onClose'),
      },
    }),
    {
      notes: {
        markdown: `
          Inputs:\n
          * \`appendTo: string | ElementRef\`
          * \`childrenPopups: PopupWidgetComponent[] = []\`
          * \`closeBtn: boolean = true\`
          * \`closeBtnInside: boolean = false\`
          * \`closeOnBrowserNav: boolean = true\`
          * \`closeOnClickOutside: boolean = true\`
          * \`closeOnResize: boolean = false\`
          * \`closeOnScroll: boolean = false\`
          * \`fullScreen: boolean = false\`
          * \`modal: boolean = false\`
          * \`parentPopup: PopupWidgetComponent\`
          * \`placement: { x: PopupWidgetXPositions, y: PopupWidgetYPositions } = { x: 'right', y: 'bottom' }\`
          * \`popupHeight: number | 'auto' = 'auto'\`
          * \`popupWidth: number = true\`
          * \`preventPageScroll: boolean = false\`
          * \`showTooltip: boolean = false\`
          * \`slider: boolean = false\`
          * \`targetOffset: { x: number, y: number }\`
          * \`targetRef: HTMLElement\`
          * \`trigger: 'click' | 'hover' = 'click'\`
          * \`transparent: boolean = false\`
          Outputs:\n
          * \`onClose: EventEmitter<void>\`
          * \`onOpen: EventEmitter<void>\`\n
          Custom Types:\n
          * \`type PopupWidgetXPositions = 'left' | 'right' | 'center'\`
          * \`type PopupWidgetYPositions = 'top' | 'bottom' | 'center'\`\n
          Usage example:\n
          \`\`\`
          <button pButton class="kButtonDefault" label="Open Modal" (click)="modal.open()"></button>
          <kPopupWidget #modal
                        [popupWidth]="300"
                        [popupHeight]="300"
                        [modal]="true"
                        (onOpen)="onOpen($event)"
                        (onClose)="onClose($event)">
            <ng-template>
              <div class="modal-container" [style.height.px]="300">
                  Modal Content
              </div>
            </ng-template>
          </kPopupWidget>
          \`\`\`
        `,
      }
    }
  )
  .add('Close Button inside', () => ({
    template: `
        <button pButton class="kButtonDefault" label="Open Modal" (click)="modal.open()"></button>
        <kPopupWidget #modal
                      [popupWidth]="300"
                      [popupHeight]="300"
                      [modal]="true"
                      [closeOnClickOutside]="false"
                      [closeBtnInside]="true"
                      [closeBtn]="false"
                      (onOpen)="onOpen($event)"
                      (onClose)="onClose($event)">
          <ng-template>
            <div class="modal-container" [style.height.px]="300">
                <button class="modal-close-btn" pButton icon="kIconclose" (click)="modal.close()"></button>
                Modal Content
            </div>
          </ng-template>
        </kPopupWidget>
    `,
    props: {
      onOpen: action('onOpen'),
      onClose: action('onClose'),
    },
  }))
  .add('Fullscreen', () => ({
    template: `
        <button class="kButtonDefault" pButton label="Open Modal" (click)="modal.open()"></button>
        <kPopupWidget #modal
                      [fullScreen]="true"
                      [modal]="true"
                      [closeOnClickOutside]="false"
                      [closeBtnInside]="true"
                      [closeBtn]="false"
                      (onOpen)="onOpen($event)"
                      (onClose)="onClose($event)">
          <ng-template>
            <div class="modal-container" [style.height.vh]="100">
                <button class="modal-close-btn" pButton icon="kIconclose" (click)="modal.close()"></button>
                Modal Content
            </div>
          </ng-template>
        </kPopupWidget>
    `,
    props: {
      onOpen: action('onOpen'),
      onClose: action('onClose'),
    },
  }))
  .add('Slider', () => ({
    template: `
        <button class="kButtonDefault" pButton label="Open Modal" (click)="modal.open()"></button>
        <kPopupWidget #modal [slider]="true" [popupWidth]="600" (onOpen)="onOpen($event)" (onClose)="onClose($event)">
          <ng-template>
            <div class="modal-container" style="height: calc(100vh - 190px)">
                <button class="modal-close-btn" pButton icon="kIconclose" (click)="modal.close()"></button>
                Modal Content
            </div>
          </ng-template>
        </kPopupWidget>
    `,
    props: {
      onOpen: action('onOpen'),
      onClose: action('onClose'),
    },
  }))
  .add('Target', () => ({
    template: `
        <button #target class="kButtonDefault" pButton label="Open Modal"></button>
        <kPopupWidget #modal
                      [popupWidth]="240"
                      [popupHeight]="240"
                      [closeBtn]="false"
                      [targetRef]="target"
                      [targetOffset]="{'x': 0, 'y': 40}"
                      (onOpen)="onOpen($event)"
                      (onClose)="onClose($event)">
          <ng-template>
            <div class="modal-container" [style.height.px]="240">
                Modal Content
            </div>
          </ng-template>
        </kPopupWidget>
    `,
    props: {
      onOpen: action('onOpen'),
      onClose: action('onClose'),
    },
  }))
  .add('Transparent', () => ({
    template: `
        <button pButton class="kButtonDefault" label="Open Modal" (click)="modal.open()"></button>
        <kPopupWidget #modal
                      [transparent]="true"
                      [modal]="true"
                      [popupWidth]="300"
                      [popupHeight]="300"
                      [closeBtn]="true"
                      (onOpen)="onOpen($event)"
                      (onClose)="onClose($event)">
          <ng-template>
            <div class="modal-container" style="color: white" [style.height.px]="300">
                No modal background
            </div>
          </ng-template>
        </kPopupWidget>
    `,
    props: {
      onOpen: action('onOpen'),
      onClose: action('onClose'),
    },
  }));
