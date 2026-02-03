import { Injectable } from '@angular/core';

export interface PdfDocumentProxy {
  numPages: number;
  getPage(pageNumber: number): Promise<PdfPageProxy>;
}

export interface PdfPageProxy {
  getViewport(options: { scale: number }): { width: number; height: number };
  render(params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }): { promise: Promise<void> };
}

export interface PdfJsLib {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(src: string | { url: string }): { promise: Promise<PdfDocumentProxy> };
}

@Injectable({
  providedIn: 'root'
})
export class PdfViewerService {
  private readonly pdfJsCdn = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  private readonly pdfWorkerCdn = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  private pdfJsLib?: PdfJsLib;
  private loadingPromise?: Promise<PdfJsLib>;

  async loadPdfJs(): Promise<PdfJsLib> {
    if (this.pdfJsLib) {
      return this.pdfJsLib;
    }

    const globalAny = window as unknown as { pdfjsLib?: PdfJsLib };
    if (globalAny.pdfjsLib) {
      this.pdfJsLib = globalAny.pdfjsLib;
      this.pdfJsLib.GlobalWorkerOptions.workerSrc = this.pdfWorkerCdn;
      return this.pdfJsLib;
    }

    if (!this.loadingPromise) {
      this.loadingPromise = new Promise<PdfJsLib>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = this.pdfJsCdn;
        script.async = true;
        script.onload = () => {
          const lib = globalAny.pdfjsLib;
          if (!lib) {
            reject(new Error('PDF.js failed to load.'));
            return;
          }
          lib.GlobalWorkerOptions.workerSrc = this.pdfWorkerCdn;
          this.pdfJsLib = lib;
          resolve(lib);
        };
        script.onerror = () => reject(new Error('PDF.js CDN failed to load.'));
        document.body.appendChild(script);
      });
    }

    return this.loadingPromise;
  }

  async loadDocument(url: string): Promise<PdfDocumentProxy> {
    const lib = await this.loadPdfJs();
    return lib.getDocument({ url }).promise;
  }

  async renderPage(
    pdf: PdfDocumentProxy,
    pageNumber: number,
    canvas: HTMLCanvasElement,
    scale: number
  ): Promise<void> {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas context not available.');
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
  }
}
