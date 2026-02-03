import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Edition } from '../../features/epaper/models/edition.model';
import { Epaper } from '../../features/epaper/models/epaper.model';
import { EpaperService } from '../../features/epaper/services/epaper.service';

interface EpaperAdminForm {
  title: string;
  date: string;
  editionId: string;
  pdfUrl: string;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  editions: Edition[] = [];
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  uploadProgress = '';
  isUploading = false;
  isTestingUrl = false;
  epapers: Epaper[] = [];
  useManualUrl = true;
  editingId: string | null = null;

  form: EpaperAdminForm = {
    title: '',
    date: this.getLocalDate(),
    editionId: '',
    pdfUrl: '',
    thumbnailUrl: ''
  };

  constructor(
    private epaperService: EpaperService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.form.date) {
      this.form.date = this.getLocalDate();
    }
    this.epaperService.getEditions().subscribe((editions) => {
      this.editions = editions;
      if (!this.form.editionId) {
        this.form.editionId = '';
      }
      if (this.form.editionId && !this.editions.find((e) => e.id === this.form.editionId)) {
        this.form.editionId = editions[0]?.id ?? '';
      }
      this.loadEpapers();
      this.cdr.detectChanges();
    });
  }

  submit(): void {
    console.log('Save Epaper clicked', this.form);
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.form.date || !this.form.editionId || !this.form.pdfUrl || this.isUploading) {
      return;
    }

    if (!this.form.title) {
      this.form.title = `${this.form.editionId.toUpperCase()} Edition ${this.form.date}`;
    }

    const normalizedDate = this.normalizeDate(this.form.date);
    this.isSaving = true;
    const payload = {
      title: this.form.title,
      date: normalizedDate,
      editionId: this.form.editionId,
      pdfUrl: this.form.pdfUrl,
      thumbnailUrl: this.form.thumbnailUrl
    };

    const request$ = this.editingId
      ? this.epaperService.updateEpaper(this.editingId, payload)
      : this.epaperService.addEpaper(payload);

    request$
      .subscribe(() => {
        this.isSaving = false;
        this.successMessage = this.editingId ? 'Epaper updated successfully.' : 'Epaper saved successfully.';
        this.form.date = normalizedDate;
        if (!this.editingId) {
          this.form.title = '';
          this.form.pdfUrl = '';
          this.form.thumbnailUrl = '';
        }
        this.editingId = null;
        this.loadEpapers();
      });
  }

  onFileSelected(event: Event): void {
    if (this.useManualUrl) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 'Uploading...';
    this.errorMessage = '';
    this.epaperService.uploadPdf(file)
      .pipe(
        finalize(() => {
          this.isUploading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          const pdfUrl = (res as { pdfUrl?: string })?.pdfUrl ?? (res as unknown as string);
          console.log('Upload response:', res);
          this.form.pdfUrl = pdfUrl || '';
          this.uploadProgress = pdfUrl ? 'Upload complete.' : '';
          this.cdr.detectChanges();
        },
        error: () => {
          console.error('Upload failed');
          this.uploadProgress = '';
          this.errorMessage = 'Failed to upload PDF. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }

  async testPdfUrl(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    const url = this.form.pdfUrl?.trim();
    if (!url) {
      this.errorMessage = 'Please enter a PDF URL first.';
      return;
    }

    this.isTestingUrl = true;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('URL not reachable');
      }
      const contentType = response.headers.get('content-type') || '';
      if (contentType && !contentType.includes('pdf')) {
        this.errorMessage = 'URL is reachable, but does not look like a PDF.';
      } else {
        this.successMessage = 'Verified successfully.';
      }
    } catch {
      this.errorMessage = 'PDF URL is not reachable. Please check the link.';
    } finally {
      this.isTestingUrl = false;
    }
  }

  onDriveLinkPaste(value: string): void {
    const url = value.trim();
    if (!url) {
      return;
    }
    const fileIdMatch = url.match(/\/file\/d\/([^/]+)/);
    const idMatch = url.match(/[?&]id=([^&]+)/);
    const fileId = fileIdMatch?.[1] || idMatch?.[1];
    if (!fileId) {
      this.errorMessage = 'Invalid Drive link.';
      return;
    }
    this.form.pdfUrl = `https://drive.google.com/file/d/${fileId}/view?usp=drive_link`;
    this.successMessage = 'Drive link added.';
  }

  onEditionChange(editionId: string): void {
    this.form.editionId = editionId || '';
    this.loadEpapers();
  }

  private loadEpapers(): void {
    this.epaperService.getAllEpapers().subscribe((items) => {
      this.epapers = this.form.editionId
        ? items.filter((item) => item.editionId === this.form.editionId)
        : items;
      this.cdr.detectChanges();
    });
  }

  editEpaper(epaper: Epaper): void {
    this.editingId = epaper.id;
    this.form.title = epaper.title;
    this.form.date = epaper.date;
    this.form.editionId = epaper.editionId;
    this.form.pdfUrl = epaper.pdfUrl;
    this.form.thumbnailUrl = epaper.thumbnailUrl || '';
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.title = '';
    this.form.pdfUrl = '';
    this.form.thumbnailUrl = '';
    this.form.date = this.getLocalDate();
    this.cdr.detectChanges();
  }

  deleteEpaper(epaper: Epaper): void {
    const confirmed = confirm(`Delete epaper "${epaper.title}"?`);
    if (!confirmed) {
      return;
    }
    this.epaperService.deleteEpaper(epaper.id).subscribe(() => {
      this.loadEpapers();
    });
  }

  private getLocalDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private normalizeDate(value: string): string {
    const parts = value.split('-');
    if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
      // dd-mm-yyyy -> yyyy-mm-dd
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return value;
  }
}
