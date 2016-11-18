import { Component, OnInit } from '@angular/core';
import { Hero } from './hero';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from './hero.service';
import { Router } from '@angular/router';


@Component({
  selector: 'my-hero',
  templateUrl: 'app/heroes.component.html',
  styleUrls: ['app/heroes.component.css'],
  directives: [HeroDetailComponent]
})

export class HeroComponent implements OnInit {
  title = 'Test of heroes';
  heroes : Hero[];

  constructor(private heroService: HeroService,
    private router: Router) {
    // this.getHeroes();
    // console.log('1')
  }

  selectedHero : Hero;

  onSelect(hero : Hero) {
    this.selectedHero = hero;
  }

  getHeroes() {
    this.heroService.getHeroes().then(function(heroes){
      this.heroes = heroes;
    }.bind(this));
  }

  ngOnInit() {
    // this.getHeroes();
    this.getHeroes();
    // console.log('1')
  }

  gotoDetail() {
    this.router.navigate(['/detail', this.selectedHero.id]);
  }
}


