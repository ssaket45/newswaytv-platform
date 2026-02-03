import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EpaperHomeComponent } from './pages/epaper-home/epaper-home.component';
import { EpaperViewerComponent } from './pages/epaper-viewer/epaper-viewer.component';
import { EpaperAdminComponent } from './pages/epaper-admin/epaper-admin.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: EpaperHomeComponent,
    title: 'Epaper'
  },
  {
    path: 'view/:id',
    component: EpaperViewerComponent,
    title: 'Epaper Viewer'
  },
  {
    path: 'admin',
    component: EpaperAdminComponent,
    canActivate: [AdminGuard],
    title: 'Epaper Admin'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EpaperRoutingModule {}
