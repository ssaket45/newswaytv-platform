import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { PdfDocumentProxy, PdfViewerService } from '../../services/pdf-viewer.service';

@Component({
  selector: 'app-pdf-canvas-viewer',
  standalone: false,
  templateUrl: './pdf-canvas-viewer.component.html',
  styleUrls: ['./pdf-canvas-viewer.component.scss']
})
export class PdfCanvasViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() pdfUrl = '';
  @Input() pageNumber = 1;
  @Input() scale = 1;

  @Output() pageCountChange = new EventEmitter<number>();
  @Output() pageRendered = new EventEmitter<number>();

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private pdfDoc?: PdfDocumentProxy;
  private renderToken = 0;
  private destroyed = false;
  private readonly isBrowser: boolean;

  constructor(
    private pdfViewer: PdfViewerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.pdfUrl) {
      this.loadDocument();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isBrowser) {
      return;
    }

    if (changes['pdfUrl'] && this.pdfUrl) {
      this.loadDocument();
      return;
    }

    if ((changes['pageNumber'] || changes['scale']) && this.pdfDoc) {
      this.renderPage();
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  private async loadDocument(): Promise<void> {
    if (!this.pdfUrl || !this.isBrowser) {
      return;
    }

    try {
      this.pdfDoc = await this.pdfViewer.loadDocument(this.pdfUrl);
      if (this.destroyed || !this.pdfDoc) {
        return;
      }
      this.pageCountChange.emit(this.pdfDoc.numPages);
      await this.renderPage();
    } catch (error) {
      console.error('Failed to load PDF document', error);
    }
  }

  private async renderPage(): Promise<void> {
    if (!this.pdfDoc) {
      return;
    }

    const token = ++this.renderToken;
    try {
      await this.pdfViewer.renderPage(
        this.pdfDoc,
        this.pageNumber,
        this.canvasRef.nativeElement,
        this.scale
      );

      if (this.destroyed || token !== this.renderToken) {
        return;
      }

      this.pageRendered.emit(this.pageNumber);
    } catch (error) {
      console.error('Failed to render PDF page', error);
    }
  }
}


