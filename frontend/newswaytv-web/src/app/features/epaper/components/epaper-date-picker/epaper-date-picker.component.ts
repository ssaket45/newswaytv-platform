import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-epaper-date-picker',
  standalone: false,
  templateUrl: './epaper-date-picker.component.html',
  styleUrls: ['./epaper-date-picker.component.scss']
})
export class EpaperDatePickerComponent implements OnInit {
  @Input() selectedDate = '';
  @Output() selectedDateChange = new EventEmitter<string>();

  ngOnInit(): void {
    if (!this.selectedDate) {
      const today = new Date();
      this.selectedDate = today.toISOString().slice(0, 10);
      this.selectedDateChange.emit(this.selectedDate);
    }
  }

  onDateChange(value: string): void {
    this.selectedDate = value;
    this.selectedDateChange.emit(value);
  }
}


