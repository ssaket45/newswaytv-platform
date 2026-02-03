import { Component, OnInit } from '@angular/core';

import { Edition } from '../../models/edition.model';
import { EpaperService } from '../../services/epaper.service';

interface EpaperAdminForm {
  title: string;
  date: string;
  editionId: string;
  pdfUrl: string;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-epaper-admin',
  standalone: false,
  templateUrl: './epaper-admin.component.html',
  styleUrls: ['./epaper-admin.component.scss']
})
export class EpaperAdminComponent implements OnInit {
  editions: Edition[] = [];
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  uploadProgress = '';

  form: EpaperAdminForm = {
    title: '',
    date: new Date().toISOString().slice(0, 10),
    editionId: '',
    pdfUrl: '',
    thumbnailUrl: ''
  };

  constructor(private epaperService: EpaperService) {}

  ngOnInit(): void {
    this.epaperService.getEditions().subscribe((editions) => {
      this.editions = editions;
      if (!this.form.editionId && editions.length) {
        this.form.editionId = editions[0].id;
      }
    });
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.form.title || !this.form.date || !this.form.editionId || !this.form.pdfUrl) {
      return;
    }

    this.isSaving = true;
    this.epaperService.addEpaper({
      title: this.form.title,
      date: this.form.date,
      editionId: this.form.editionId,
      pdfUrl: this.form.pdfUrl,
      thumbnailUrl: this.form.thumbnailUrl
    })
      .subscribe(() => {
        this.isSaving = false;
        this.successMessage = 'Epaper saved successfully.';
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.uploadProgress = 'Uploading...';
    this.errorMessage = '';
    this.epaperService.uploadPdf(file).subscribe({
      next: (res) => {
        this.form.pdfUrl = res.pdfUrl;
        this.uploadProgress = 'Upload complete.';
      },
      error: () => {
        this.uploadProgress = '';
        this.errorMessage = 'Failed to upload PDF. Please try again.';
      }
    });
  }
}
