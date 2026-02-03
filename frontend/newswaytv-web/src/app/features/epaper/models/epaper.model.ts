export interface Epaper {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  editionId: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  pages?: number;
}
