import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EpaperAdminComponent } from './epaper-admin.component';
import { EpaperService } from '../../services/epaper.service';

class EpaperServiceStub {
  getEditions() {
    return { subscribe: (fn: any) => fn([]) };
  }
  addEpaper() {
    return { subscribe: (fn: any) => fn() };
  }
}

describe('EpaperAdminComponent', () => {
  let component: EpaperAdminComponent;
  let fixture: ComponentFixture<EpaperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EpaperAdminComponent],
      imports: [FormsModule],
      providers: [{ provide: EpaperService, useClass: EpaperServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EpaperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
