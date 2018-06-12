import { TestBed, inject } from '@angular/core/testing';

import { KalturaUiService } from './kaltura-ui.service';

describe('KalturaUiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KalturaUiService]
    });
  });

  it('should be created', inject([KalturaUiService], (service: KalturaUiService) => {
    expect(service).toBeTruthy();
  }));
});
