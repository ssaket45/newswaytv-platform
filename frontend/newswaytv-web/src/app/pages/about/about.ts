import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for About page
    this.title.setTitle('About NewsWayTV – Latest News, Team & Mission');
    this.meta.updateTag({
      name: 'description',
      content: 'Learn about NewsWayTV, our mission, editorial values, and the team behind your trusted source for trending news in India.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'about, NewsWayTV, team, mission, journalism, values, contact'
    });
    // SSR compatibility: meta tags will be rendered on server if isPlatformServer
  }
}
