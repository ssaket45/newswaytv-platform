import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pdf-toolbar',
  standalone: false,
  templateUrl: './pdf-toolbar.component.html',
  styleUrls: ['./pdf-toolbar.component.scss']
})
export class PdfToolbarComponent {
  @Input() pageNumber = 1;
  @Input() pageCount = 1;
  @Input() zoom = 1;
  @Input() minZoom = 0.5;
  @Input() maxZoom = 3;
  @Input() isFullscreen = false;

  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() prevPage = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();
  @Output() toggleFullscreen = new EventEmitter<void>();

  get isFirstPage(): boolean {
    return this.pageNumber <= 1;
  }

  get isLastPage(): boolean {
    return this.pageNumber >= this.pageCount;
  }

  get canZoomIn(): boolean {
    return this.zoom < this.maxZoom;
  }

  get canZoomOut(): boolean {
    return this.zoom > this.minZoom;
  }
}


