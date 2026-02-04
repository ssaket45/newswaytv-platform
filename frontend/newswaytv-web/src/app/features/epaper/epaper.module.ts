import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EpaperRoutingModule } from './epaper-routing.module';
import { EpaperHomeComponent } from './pages/epaper-home/epaper-home.component';
import { EpaperViewerComponent } from './pages/epaper-viewer/epaper-viewer.component';
import { EpaperAdminComponent } from './pages/epaper-admin/epaper-admin.component';
import { PdfCanvasViewerComponent } from './components/pdf-canvas-viewer/pdf-canvas-viewer.component';
import { PdfToolbarComponent } from './components/pdf-toolbar/pdf-toolbar.component';
import { EpaperDatePickerComponent } from './components/epaper-date-picker/epaper-date-picker.component';
import { EpaperEditionSelectorComponent } from './components/epaper-edition-selector/epaper-edition-selector.component';
import { EpaperLoaderComponent } from './components/epaper-loader.component';

@NgModule({
  declarations: [
    EpaperHomeComponent,
    EpaperViewerComponent,
    EpaperAdminComponent,
    PdfCanvasViewerComponent,
    PdfToolbarComponent,
    EpaperDatePickerComponent,
    EpaperEditionSelectorComponent,
    // EpaperLoaderComponent (standalone, imported below)
  ],
  imports: [CommonModule, FormsModule, RouterModule, EpaperRoutingModule, EpaperLoaderComponent]
})
export class EpaperModule {}
