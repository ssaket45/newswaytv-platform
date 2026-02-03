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
  epapers: Epaper[] = [];

  form: EpaperAdminForm = {
    title: '',
    date: new Date().toISOString().slice(0, 10),
    editionId: '',
    pdfUrl: '',
    thumbnailUrl: ''
  };

  constructor(
    private epaperService: EpaperService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.epaperService.getEditions().subscribe((editions) => {
      this.editions = editions;
      if (!this.form.editionId && editions.length) {
        const ideaCity = editions.find((edition) => edition.id === 'ideacity');
        this.form.editionId = ideaCity ? ideaCity.id : editions[0].id;
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
    this.epaperService.addEpaper({
      title: this.form.title,
      date: normalizedDate,
      editionId: this.form.editionId,
      pdfUrl: this.form.pdfUrl,
      thumbnailUrl: this.form.thumbnailUrl
    })
      .subscribe(() => {
        this.isSaving = false;
        this.successMessage = 'Epaper saved successfully.';
        this.form.date = normalizedDate;
        this.loadEpapers();
      });
  }

  onFileSelected(event: Event): void {
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

  private normalizeDate(value: string): string {
    const parts = value.split('-');
    if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
      // dd-mm-yyyy -> yyyy-mm-dd
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return value;
  }
}
