import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, isPlatformServer } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
interface Article {
  title: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-category',
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  categoryName = 'Celebrity'; // This should be set dynamically from route params in a real app
  loading = true;
  articles: Article[] = [];

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for Category page
    const pageTitle = `${this.categoryName} News – NewsWayTV`;
    this.title.setTitle(pageTitle);
    this.meta.updateTag({
      name: 'description',
      content: `Latest articles and updates in the ${this.categoryName} category on NewsWayTV.`
    });
    this.meta.updateTag({
      name: 'keywords',
      content: `${this.categoryName.toLowerCase()}, news, celebrity, tech, auto, festival, trending, NewsWayTV`
    });
    // SSR compatibility: meta tags will be rendered on server if isPlatformServer

    // Simulate loading delay
    setTimeout(() => {
      this.articles = [
        {
          title: 'Star Couple Announces Engagement',
          description: 'Breaking news as the celebrity couple reveals their engagement plans to fans.',
          date: '2026-01-10'
        },
        {
          title: 'Charity Gala Raises Millions',
          description: 'Celebrities unite for a night of giving, raising funds for global causes.',
          date: '2026-01-08'
        },
        {
          title: 'Behind the Scenes: Movie Blockbuster',
          description: 'Exclusive insights from the set of the year’s most anticipated film.',
          date: '2026-01-05'
        }
      ];
      this.loading = false;
    }, 1200);
  }
}
