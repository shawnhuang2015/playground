import { provideRouter, RouterConfig} from '@angular/router';
import { HeroComponent } from './hero.component';
import { DashboardComponent } from './dashboard.component';
import { HeroDetailComponent } from './hero-detail.component'

const routes: RouterConfig = [
  {
    path: 'hero',
    component: HeroComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    pathMatch: 'full'
  },
  {
    path: 'detail/:id',
    component: HeroDetailComponent
  }
];

export const appRouterProviders = [
  provideRouter(routes)
];
