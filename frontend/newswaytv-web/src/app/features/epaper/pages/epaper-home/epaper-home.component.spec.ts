import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { EpaperHomeComponent } from './epaper-home.component';
import { EpaperService } from '../../services/epaper.service';

class EpaperServiceStub {
  getEditions() {
    return { subscribe: (fn: any) => fn([]) };
  }
  getEpapersByDate() {
    return { subscribe: (fn: any) => fn([]) };
  }
}

describe('EpaperHomeComponent', () => {
  let component: EpaperHomeComponent;
  let fixture: ComponentFixture<EpaperHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EpaperHomeComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: EpaperService, useClass: EpaperServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EpaperHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
