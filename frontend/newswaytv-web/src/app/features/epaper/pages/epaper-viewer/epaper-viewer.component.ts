// ...existing code...
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Epaper } from '../../models/epaper.model';
import { EpaperService } from '../../services/epaper.service';
import { clamp } from '../../utils/pdf-utils';

@Component({
  selector: 'app-epaper-viewer',
  standalone: false,
  templateUrl: './epaper-viewer.component.html',
  styleUrls: ['./epaper-viewer.component.scss']
})
export class EpaperViewerComponent implements OnInit {
    goBack(): void {
      window.history.back();
    }
  epaper: Epaper | null = null;
  pdfUrl = '';
  drivePreviewUrl = '';
  drivePreviewSafeUrl?: SafeResourceUrl;
  pageNumber = 1;
  pageCount = 1;
  zoom = 1;
  readonly minZoom = 0.6;
  readonly maxZoom = 2.5;
  isLoading = true;
  isFullscreen = false;
  private readonly isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private epaperService: EpaperService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
      }

      this.isLoading = true;
      this.epaperService.getEpaperById(id).subscribe((epaper) => {
        this.epaper = epaper;
        this.pdfUrl = epaper?.pdfUrl ?? '';
        this.drivePreviewUrl = this.getDrivePreviewUrl(this.pdfUrl);
        this.drivePreviewSafeUrl = this.drivePreviewUrl
          ? this.sanitizer.bypassSecurityTrustResourceUrl(this.drivePreviewUrl)
          : undefined;
        this.isLoading = false;
        this.cdr.detectChanges();
      });
    });
  }

  onPageCountChange(count: number): void {
    this.pageCount = count;
    this.pageNumber = clamp(this.pageNumber, 1, this.pageCount);
  }

  nextPage(): void {
    this.pageNumber = clamp(this.pageNumber + 1, 1, this.pageCount);
  }

  prevPage(): void {
    this.pageNumber = clamp(this.pageNumber - 1, 1, this.pageCount);
  }

  zoomIn(): void {
    this.zoom = clamp(this.zoom + 0.1, this.minZoom, this.maxZoom);
  }

  zoomOut(): void {
    this.zoom = clamp(this.zoom - 0.1, this.minZoom, this.maxZoom);
  }

  downloadPdf(): void {
    if (!this.pdfUrl) {
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = this.pdfUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.download = `${this.epaper?.title ?? 'epaper'}.pdf`;
    anchor.click();
  }

  setPage(page: number): void {
    this.pageNumber = clamp(page, 1, this.pageCount);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }

  trackByPage(_: number, page: number): number {
    return page;
  }

  toggleFullscreen(): void {
    if (!this.isBrowser) {
      return;
    }

    const doc = document as Document & { fullscreenElement?: Element };
    if (!doc.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      this.isFullscreen = true;
      return;
    }

    document.exitFullscreen?.();
    this.isFullscreen = false;
  }

  private getDrivePreviewUrl(url: string): string {
    if (!url || !url.includes('drive.google.com')) {
      return '';
    }

    const fileIdMatch = url.match(/\/file\/d\/([^/]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }

    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }

    return '';
  }
}


