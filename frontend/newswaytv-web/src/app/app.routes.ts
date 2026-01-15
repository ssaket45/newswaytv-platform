
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Category } from './pages/category/category';
import { Article } from './pages/article/article';
import { Login } from './admin/login/login';
import { Dashboard } from './admin/dashboard/dashboard';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { Terms } from './pages/terms/terms';
import { Disclaimer } from './pages/disclaimer/disclaimer';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full',
    title: 'Home'
  },
  {
    path: 'category/:slug',
    component: Category,
    title: 'Category'
  },
  {
    path: 'article/:slug',
    component: Article,
    title: 'Article'
  },
  {
    path: 'admin/login',
    component: Login,
    title: 'Admin Login'
  },
  {
    path: 'admin/dashboard',
    component: Dashboard,
    title: 'Admin Dashboard'
  },
  {
    path: 'about',
    component: About,
    title: 'About Us'
  },
  {
    path: 'contact',
    component: Contact,
    title: 'Contact Us'
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicy,
    title: 'Privacy Policy'
  },
  {
    path: 'terms',
    component: Terms,
    title: 'Terms & Conditions'
  },
  {
    path: 'disclaimer',
    component: Disclaimer,
    title: 'Disclaimer'
  }
  // Future: Use loadChildren for lazy loading modules
];
