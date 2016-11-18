import { Component, OnInit } from '@angular/core';

import { Hero } from './hero';
import { HeroService } from './hero.service';

import { Router } from '@angular/router';

@Component ({
  selector : 'my-dashboard',
  // template : '<h3> My Dashboard </h3>'
  templateUrl: 'app/dashboard.component.html',
  styleUrls: ['app/dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService,
    private router: Router) {

  }

  ngOnInit() {
    this.heroService.getHeroes()
    .then(heroes => this.heroes = heroes);
  }

  gotoDetail(hero) {
    let link = ['/detail', hero.id];
    console.log(link);
    this.router.navigate(link);
  }
}