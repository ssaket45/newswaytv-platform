import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { delay, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Edition } from '../models/edition.model';
import { Epaper } from '../models/epaper.model';

@Injectable({
  providedIn: 'root'
})
export class EpaperService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly storageMode = environment.storageMode;
  private readonly isBrowser: boolean;
  private readonly localKey = 'epaper_store_v1';

  private readonly editions: Edition[] = [
    { id: 'mumbai', name: 'Mumbai', slug: 'mumbai' },
    { id: 'delhi', name: 'Delhi', slug: 'delhi' },
    { id: 'pune', name: 'Pune', slug: 'pune' },
    { id: 'ideacity', name: 'Idea City', slug: 'ideacity' }
  ];

  private epapers: Epaper[] = [
    {
      id: 'mumbai-2026-02-03',
      title: 'Mumbai Edition',
      date: '2026-02-03',
      editionId: 'mumbai',
      pdfUrl: `${this.baseUrl}/epaper/mumbai/2026-02-03.pdf`,
      thumbnailUrl: `${this.baseUrl}/epaper/mumbai/2026-02-03.jpg`,
      pages: 16
    },
    {
      id: 'delhi-2026-02-03',
      title: 'Delhi Edition',
      date: '2026-02-03',
      editionId: 'delhi',
      pdfUrl: `${this.baseUrl}/epaper/delhi/2026-02-03.pdf`,
      thumbnailUrl: `${this.baseUrl}/epaper/delhi/2026-02-03.jpg`,
      pages: 18
    },
    {
      id: 'pune-2026-02-03',
      title: 'Pune Edition',
      date: '2026-02-03',
      editionId: 'pune',
      pdfUrl: `${this.baseUrl}/epaper/pune/2026-02-03.pdf`,
      thumbnailUrl: `${this.baseUrl}/epaper/pune/2026-02-03.jpg`,
      pages: 14
    }
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.hydrateLocalStorage();
  }

  getEditions(): Observable<Edition[]> {
    if (this.storageMode === 'api') {
      return this.http.get<Edition[]>(`${this.baseUrl}/epaper/editions`);
    }

    return of(this.editions).pipe(delay(150));
  }

  getEpapersByDate(date: string, editionId: string | null): Observable<Epaper[]> {
    if (this.storageMode === 'api') {
      const params: string[] = [];
      if (date) {
        params.push(`date=${encodeURIComponent(date)}`);
      }
      if (editionId) {
        params.push(`editionId=${encodeURIComponent(editionId)}`);
      }
      const query = params.length ? `?${params.join('&')}` : '';
      return this.http.get<Epaper[]>(`${this.baseUrl}/epaper${query}`);
    }

    return of(this.epapers).pipe(
      delay(200),
      map((items) =>
        items.filter((item) =>
          item.date === date && (!editionId || item.editionId === editionId)
        )
      )
    );
  }

  getAllEpapers(): Observable<Epaper[]> {
    if (this.storageMode === 'api') {
      return this.http.get<Epaper[]>(`${this.baseUrl}/epaper`);
    }

    return of(this.epapers).pipe(delay(150));
  }

  getEpaperById(id: string): Observable<Epaper | null> {
    if (this.storageMode === 'api') {
      return this.http.get<Epaper>(`${this.baseUrl}/epaper/${id}`);
    }

    return of(this.epapers.find((item) => item.id === id) ?? null).pipe(delay(150));
  }

  addEpaper(payload: Omit<Epaper, 'id' | 'pages'>): Observable<Epaper> {
    if (this.storageMode === 'api') {
      return this.http.post<Epaper>(`${this.baseUrl}/epaper`, payload);
    }

    const id = `${payload.editionId}-${payload.date}`;
    const epaper: Epaper = {
      ...payload,
      id,
      pages: 0
    };
    this.epapers = [epaper, ...this.epapers];
    this.persistLocalStorage();
    return of(epaper).pipe(delay(300));
  }

  uploadPdf(file: File): Observable<{ pdfUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<{ pdfUrl: string }>(`${this.baseUrl}/epaper/upload`, formData)
      .pipe(timeout(30000));
  }

  private hydrateLocalStorage(): void {
    if (!this.isBrowser || this.storageMode === 'api') {
      return;
    }

    try {
      const raw = localStorage.getItem(this.localKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { epapers?: Epaper[] };
        if (parsed?.epapers?.length) {
          this.epapers = parsed.epapers;
        }
      } else {
        this.persistLocalStorage();
      }
    } catch (error) {
      console.warn('Failed to read epaper local storage', error);
    }
  }

  private persistLocalStorage(): void {
    if (!this.isBrowser || this.storageMode === 'api') {
      return;
    }

    try {
      localStorage.setItem(
        this.localKey,
        JSON.stringify({ epapers: this.epapers })
      );
    } catch (error) {
      console.warn('Failed to persist epaper local storage', error);
    }
  }
}
