import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Edition } from '../../models/edition.model';

@Component({
  selector: 'app-epaper-edition-selector',
  standalone: false,
  templateUrl: './epaper-edition-selector.component.html',
  styleUrls: ['./epaper-edition-selector.component.scss']
})
export class EpaperEditionSelectorComponent {
  @Input() editions: Edition[] = [];
  ngOnChanges() {
    console.log('Edition selector received editions:', this.editions);
  }
  @Input() selectedEditionId: string = '';
  @Output() editionChange = new EventEmitter<string>();

  onEditionChange(event: Event | string): void {
    let value: string;
    if (typeof event === 'string') {
      value = event;
    } else {
      const target = event.target as HTMLSelectElement | null;
      value = target?.value || '';
    }
    this.selectedEditionId = value;
    this.editionChange.emit(value);
  }
}


