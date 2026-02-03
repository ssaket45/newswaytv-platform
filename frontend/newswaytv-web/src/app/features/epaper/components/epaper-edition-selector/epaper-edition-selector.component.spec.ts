import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { EpaperEditionSelectorComponent } from './epaper-edition-selector.component';

describe('EpaperEditionSelectorComponent', () => {
  let component: EpaperEditionSelectorComponent;
  let fixture: ComponentFixture<EpaperEditionSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EpaperEditionSelectorComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EpaperEditionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
