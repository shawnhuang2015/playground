import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HeroService }     from './hero.service';

@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <nav>
      <a [routerLink]="['/dashboard']" routerLinkActive="active">Dashboard</a>
      <a [routerLink]="['/hero']" routerLinkActive="active">Hero</a>
      <a [routerLink]="['/detail/11']" routerLinkActive="active">Detail</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [
    HeroService
  ],
  styleUrls: ['app/app.component.css'],

})

export class AppComponent {
  title = 'Hello World of Heroes';
}
