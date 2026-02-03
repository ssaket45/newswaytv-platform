import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Edition } from '../../models/edition.model';
import { Epaper } from '../../models/epaper.model';
import { EpaperService } from '../../services/epaper.service';

@Component({
  selector: 'app-epaper-home',
  standalone: false,
  templateUrl: './epaper-home.component.html',
  styleUrls: ['./epaper-home.component.scss']
})
export class EpaperHomeComponent implements OnInit {
  editions: Edition[] = [];
  selectedEditionId: string | null = null;
  selectedDate = '';
  epapers: Epaper[] = [];
  isLoading = false;

  constructor(
    private epaperService: EpaperService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEditions();
  }

  onDateChange(date: string): void {
    this.selectedDate = date;
    this.loadEpapers();
  }

  onEditionChange(editionId: string | null): void {
    this.selectedEditionId = editionId;
    this.loadEpapers();
  }

  openEpaper(epaper: Epaper): void {
    this.router.navigate(['/epaper/view', epaper.id]);
  }

  private loadEditions(): void {
    this.epaperService.getEditions().subscribe((editions) => {
      this.editions = editions;
      if (!this.selectedEditionId && editions.length) {
        const ideaCity = editions.find((edition) => edition.id === 'ideacity');
        this.selectedEditionId = ideaCity ? ideaCity.id : editions[0].id;
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
        this.cdr.detectChanges();
      });
  }
}


