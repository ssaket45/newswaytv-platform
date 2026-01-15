
import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('newswaytv-web');

  constructor(public router: Router) {}
}
