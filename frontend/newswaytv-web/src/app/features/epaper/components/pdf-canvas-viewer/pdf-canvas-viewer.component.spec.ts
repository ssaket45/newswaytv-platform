import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfCanvasViewerComponent } from './pdf-canvas-viewer.component';
import { PdfViewerService } from '../../services/pdf-viewer.service';
import { PLATFORM_ID } from '@angular/core';

class PdfViewerServiceStub {
  loadDocument(): Promise<any> {
    return Promise.resolve({ numPages: 1 });
  }
  renderPage(): Promise<void> {
    return Promise.resolve();
  }
}

describe('PdfCanvasViewerComponent', () => {
  let component: PdfCanvasViewerComponent;
  let fixture: ComponentFixture<PdfCanvasViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PdfCanvasViewerComponent],
      providers: [
        { provide: PdfViewerService, useClass: PdfViewerServiceStub },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfCanvasViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
