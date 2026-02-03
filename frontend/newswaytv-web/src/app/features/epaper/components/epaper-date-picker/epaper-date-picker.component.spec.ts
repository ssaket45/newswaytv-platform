import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { EpaperDatePickerComponent } from './epaper-date-picker.component';

describe('EpaperDatePickerComponent', () => {
  let component: EpaperDatePickerComponent;
  let fixture: ComponentFixture<EpaperDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EpaperDatePickerComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EpaperDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
