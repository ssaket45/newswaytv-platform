import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, isPlatformServer } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
  categoryName = '';
  loading = true;
  articles: Article[] = [];

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const slug = params.get('slug') || 'celebrity';
      this.categoryName = this.getCategoryNameFromSlug(slug);
      this.setMetaTags();
      this.loading = true;
      this.articles = [];

      // Always show mock data after 2 seconds
      setTimeout(() => {
        this.articles = this.getArticlesForCategory(slug);
        this.loading = false;
      }, 2000);
    });
  }

  getCategoryNameFromSlug(slug: string): string {
    switch (slug) {
      case 'celebrity': return 'Celebrity';
      case 'auto-bike': return 'Auto & Bike';
      case 'tech': return 'Tech';
      case 'festivals': return 'Festivals';
      default: return slug.charAt(0).toUpperCase() + slug.slice(1);
    }
  }

  getArticlesForCategory(slug: string): Article[] {
    switch (slug) {
      case 'celebrity':
        return [
          { title: 'Star Couple Announces Engagement', description: 'Breaking news as the celebrity couple reveals their engagement plans to fans.', date: '2026-01-10' },
          { title: 'Star Couple Announces Engagement', description: 'Breaking news as the celebrity couple reveals their engagement plans to fans.', date: '2026-01-10' },
          { title: 'Charity Gala Raises Millions', description: 'Celebrities unite for a night of giving, raising funds for global causes.', date: '2026-01-08' },
          { title: 'Star Couple Announces Engagement', description: 'Breaking news as the celebrity couple reveals their engagement plans to fans.', date: '2026-01-10' },
          { title: 'Charity Gala Raises Millions', description: 'Celebrities unite for a night of giving, raising funds for global causes.', date: '2026-01-08' },
          { title: 'Star Couple Announces Engagement', description: 'Breaking news as the celebrity couple reveals their engagement plans to fans.', date: '2026-01-10' },
          { title: 'Charity Gala Raises Millions', description: 'Celebrities unite for a night of giving, raising funds for global causes.', date: '2026-01-08' },
          { title: 'Star Couple Announces Engagement', description: 'Breaking news as the celebrity couple reveals their engagement plans to fans.', date: '2026-01-10' },
          { title: 'Charity Gala Raises Millions', description: 'Celebrities unite for a night of giving, raising funds for global causes.', date: '2026-01-08' },
          { title: 'Charity Gala Raises Millions', description: 'Celebrities unite for a night of giving, raising funds for global causes.', date: '2026-01-08' },
          { title: 'Behind the Scenes: Movie Blockbuster', description: 'Exclusive insights from the set of the year’s most anticipated film.', date: '2026-01-05' }
        ];
      case 'auto-bike':
        return [
          { title: 'Electric Bikes Set to Dominate 2026 Auto Expo', description: 'Auto & bike enthusiasts gear up for the latest innovations in electric mobility at this year’s expo.', date: '2026-01-09' },
          { title: 'Bike Safety Tech: What’s New?', description: 'Discover the latest advancements in bike safety and rider technology.', date: '2026-01-07' }
        ];
      case 'tech':
        return [
          { title: 'AI Revolutionizes Smartphone Photography', description: 'Tech giants unveil new AI-powered camera features, changing the way we capture moments.', date: '2026-01-12' },
          { title: 'Quantum Computing: The Next Leap', description: 'A look at how quantum computers are set to change the tech landscape.', date: '2026-01-06' }
        ];
      case 'festivals':
        return [
          { title: 'Diwali 2026: Festival of Lights Preview', description: 'Everything you need to know about this year’s Diwali celebrations.', date: '2026-01-03' },
          { title: 'Holi Colors: Safety Tips for 2026', description: 'How to enjoy Holi safely and responsibly this year.', date: '2026-01-02' }
        ];
      default:
        return [
          { title: `No articles found for ${this.getCategoryNameFromSlug(slug)}`, description: 'Please check back later for updates.', date: '2026-01-01' }
        ];
    }
  }

  setMetaTags(): void {
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
  }
}
