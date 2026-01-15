import { Component } from '@angular/core';
import { NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-category',
  imports: [NgFor, DatePipe],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
  categoryName = 'Celebrity'; // This should be set dynamically from route params in a real app
  articles = [
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
}
