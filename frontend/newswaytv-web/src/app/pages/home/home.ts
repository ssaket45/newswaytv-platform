import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for Home page
    this.title.setTitle('NewsWayTV – Latest Celebrity, Tech, Auto & Festival News');
    this.meta.updateTag({
      name: 'description',
      content: 'Stay updated with NewsWayTV for the latest celebrity news, technology trends, automobile updates, and festival highlights. Your trusted source for trending news and in-depth articles.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'news, celebrity news, tech news, auto news, festival news, trending, latest updates, NewsWayTV'
    });
    // SSR compatibility: meta tags will be rendered on server if isPlatformServer
  }
}
