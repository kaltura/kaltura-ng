import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KalturaUiComponent } from './kaltura-ui.component';

describe('KalturaUiComponent', () => {
  let component: KalturaUiComponent;
  let fixture: ComponentFixture<KalturaUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KalturaUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KalturaUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
