import {TieredDropdownComponent} from './tiered-dropdown.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SelectItem} from 'primeng/api';

describe('TieredDropdownComponent', () => {
  let component: TieredDropdownComponent;
  let fixture: ComponentFixture<TieredDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TieredDropdownComponent],
      providers: [],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TieredDropdownComponent);
    component = fixture.componentInstance;
    component.items = [
      {
        label: 'First',
        value: 1,
        icon: 'kIconsmiley',
        styleClass: undefined,
      },
      {
        label: 'Third',
        icon: 'kIconsmiley',
        items: [
          {
            label: 'Third.First',
            value: 3.5,
            icon: 'kIconsmiley',
            styleClass: undefined
          },
          {
            label: 'Third.Second',
            value: 3.2,
            icon: 'kIconsmiley',
            styleClass: undefined
          },
        ]
      },
      {
        label: 'Disabled',
        value: 5,
        disabled: true,
        icon: 'kIconsmiley',
        styleClass: undefined
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create menu items', () => {
    const expectedMenuItems = [{
      label: 'First',
      icon: 'kIconsmiley',
      disabled: false,
      value: 1,
      styleClass: undefined,
      command: jasmine.any(Function)
    },
      {
        label: 'Third',
        icon: 'kIconsmiley',
        items: [
          {
            label: 'Third.First',
            icon: 'kIconsmiley',
            disabled: false,
            value: 3.5,
            styleClass: undefined,
            command: jasmine.any(Function)
          },
          {
            label: 'Third.Second',
            icon: 'kIconsmiley',
            disabled: false,
            value: 3.2,
            styleClass: undefined,
            command: jasmine.any(Function)
          }
        ]
      },
      {
        label: 'Disabled',
        icon: 'kIconsmiley',
        disabled: true,
        value: 5,
        styleClass: undefined,
        command: jasmine.any(Function)
      }
    ];

    expect(component.menuItems).toEqual(expectedMenuItems);

  });

  it('should emit on change', () => {
    const selectItem = spyOn(component, 'selectItem');
    component.menuItems[0].command();
    expect(selectItem).toHaveBeenCalled();

  });


  it('should select item', () => {
    const writeValue = spyOn(component, 'writeValue');

    component.selectItem({
      label: 'First',
      value: 1,
      icon: 'kIconsmiley',
      styleClass: undefined,
    }, {});
    expect(writeValue).toHaveBeenCalled();
  });
});
