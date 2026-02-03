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
  @Input() selectedEditionId: string = '';
  @Output() editionChange = new EventEmitter<string>();

  onEditionChange(value: string): void {
    this.selectedEditionId = value;
    this.editionChange.emit(value);
  }
}


