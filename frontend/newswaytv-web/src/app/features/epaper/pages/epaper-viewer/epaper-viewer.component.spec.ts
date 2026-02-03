import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EpaperViewerComponent } from './epaper-viewer.component';
import { EpaperService } from '../../services/epaper.service';

class EpaperServiceStub {
  getEpaperById() {
    return of(null);
  }
}

describe('EpaperViewerComponent', () => {
  let component: EpaperViewerComponent;
  let fixture: ComponentFixture<EpaperViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EpaperViewerComponent],
      providers: [
        { provide: EpaperService, useClass: EpaperServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map([['id', 'test-id']])
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EpaperViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
