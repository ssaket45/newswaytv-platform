import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-latest-update',
  standalone: true,
  templateUrl: './latest-update.html',
  styleUrl: './latest-update.css',
})
export class LatestUpdate {
  @Input() text: string = 'This is the latest update!';
}
