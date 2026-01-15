
import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { LatestUpdate } from './layout/latest-update/latest-update';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, Header, Footer, LatestUpdate],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('newswaytv-web');
  latestUpdateText = 'Welcome to NewsWayTV! Stay tuned for the latest updates.';

  constructor(public router: Router) {}
}
