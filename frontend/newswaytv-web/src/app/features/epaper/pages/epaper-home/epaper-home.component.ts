import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { Edition } from '../../models/edition.model';
import { Epaper } from '../../models/epaper.model';
import { EpaperService } from '../../services/epaper.service';
import { PdfViewerService } from '../../services/pdf-viewer.service';

@Component({
  selector: 'app-epaper-home',
  standalone: false,
  templateUrl: './epaper-home.component.html',
  styleUrls: ['./epaper-home.component.scss']
})
export class EpaperHomeComponent implements OnInit {
  editions: Edition[] = [];
  selectedEditionId = '';
  selectedDate = '';
  epapers: Epaper[] = [];
  isLoading = false;
  thumbnailMap: Record<string, string> = {};
  private readonly isBrowser: boolean;

  constructor(
    private epaperService: EpaperService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private pdfViewer: PdfViewerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.selectedDate) {
      this.selectedDate = this.getLocalDate();
    }
    this.loadEditions();
  }

  onDateChange(date: string): void {
    this.selectedDate = date;
    this.loadEpapers();
  }

  onEditionChange(editionId: string): void {
    this.selectedEditionId = editionId;
    this.loadEpapers();
  }

  openEpaper(epaper: Epaper): void {
    this.router.navigate(['/epaper/view', epaper.id]);
  }

  private loadEditions(): void {
    this.epaperService.getEditions().subscribe((editions) => {
      this.editions = editions;
      if (!this.selectedEditionId) {
        this.selectedEditionId = '';
      }
      if (this.selectedDate) {
        this.loadEpapers();
      }
      this.cdr.detectChanges();
    });
  }

  private loadEpapers(): void {
    if (!this.selectedDate) {
      return;
    }

    this.isLoading = true;
    this.epaperService
      .getEpapersByDate(this.selectedDate, this.selectedEditionId)
      .subscribe((items) => {
        this.epapers = items;
        this.isLoading = false;
        if (this.isBrowser) {
          this.generateThumbnails(items);
        }
        this.cdr.detectChanges();
      });
  }

  getThumbnail(epaper: Epaper): string | null {
    if (epaper.thumbnailUrl) {
      return epaper.thumbnailUrl;
    }
    return this.thumbnailMap[epaper.id] || null;
  }

  private async generateThumbnails(items: Epaper[]): Promise<void> {
    for (const epaper of items) {
      if (this.thumbnailMap[epaper.id]) {
        continue;
      }

      if (this.isDriveLink(epaper.pdfUrl)) {
        this.thumbnailMap[epaper.id] = this.createTextThumbnail(epaper.title, epaper.date);
        continue;
      }

      try {
        const pdf = await this.pdfViewer.loadDocument(epaper.pdfUrl);
        const canvas = document.createElement('canvas');
        await this.pdfViewer.renderPage(pdf, 1, canvas, 0.3);
        this.thumbnailMap[epaper.id] = canvas.toDataURL('image/jpeg', 0.8);
        this.cdr.detectChanges();
      } catch {
        this.thumbnailMap[epaper.id] = this.createTextThumbnail(epaper.title, epaper.date);
      }
    }
  }

  private isDriveLink(url: string): boolean {
    return url.includes('drive.google.com');
  }

  private createTextThumbnail(title: string, date: string): string {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return '';
    }
    ctx.fillStyle = '#f0e9df';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#8a1c1c';
    ctx.font = 'bold 22px serif';
    ctx.fillText('Epaper', 24, 40);
    ctx.fillStyle = '#222222';
    ctx.font = 'bold 20px serif';
    ctx.fillText(title, 24, 90);
    ctx.fillStyle = '#5a5a5a';
    ctx.font = '16px serif';
    ctx.fillText(date, 24, 130);
    return canvas.toDataURL('image/png');
  }

  private getLocalDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}


