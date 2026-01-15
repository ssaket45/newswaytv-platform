import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-article',
  imports: [],
  templateUrl: './article.html',
  styleUrl: './article.css',
})
export class Article implements OnInit {
  articleTitle = 'AI Revolutionizes Smartphone Photography';
  author = 'Jane Reporter';
  publishDate = '2026-01-12';

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for Article page
    this.title.setTitle(`${this.articleTitle} – NewsWayTV`);
    this.meta.updateTag({
      name: 'description',
      content: 'Tech giants unveil new AI-powered camera features, changing the way we capture moments. The latest advancements in artificial intelligence are making smartphone photography smarter, faster, and more creative than ever before.'
    });
    this.meta.updateTag({
      name: 'author',
      content: this.author
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'AI, smartphone, photography, technology, NewsWayTV, article'
    });
    // SSR compatibility: meta tags will be rendered on server if isPlatformServer
  }
}
