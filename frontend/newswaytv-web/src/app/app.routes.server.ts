import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'epaper/view/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'epaper',
    renderMode: RenderMode.Server
  },
  {
    path: 'category/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'article/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
