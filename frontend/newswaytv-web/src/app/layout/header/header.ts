import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  showNav = false;
  @ViewChild('mainNav', { static: false }) mainNavRef!: ElementRef;
  @ViewChild('navToggle', { static: false }) navToggleRef!: ElementRef;

  toggleNav(event: Event) {
    this.showNav = !this.showNav;
    if (typeof document !== 'undefined') {
      if (this.showNav) {
        setTimeout(() => {
          document.addEventListener('click', this.handleOutsideClick, true);
        });
      } else {
        document.removeEventListener('click', this.handleOutsideClick, true);
      }
    }
    event.stopPropagation();
  }

  closeNav() {
    this.showNav = false;
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.handleOutsideClick, true);
    }
  }

  handleOutsideClick = (event: Event) => {
    const nav = this.mainNavRef?.nativeElement as HTMLElement;
    const toggle = this.navToggleRef?.nativeElement as HTMLElement;
    if (
      nav &&
      !nav.contains(event.target as Node) &&
      toggle &&
      !toggle.contains(event.target as Node)
    ) {
      this.closeNav();
    }
  };

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.handleOutsideClick, true);
    }
  }
}
