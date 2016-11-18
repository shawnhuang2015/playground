import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Hero} from './hero';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from './hero.service';


@Component ({
  selector: 'my-hero-detail',
  templateUrl: 'app/hero-detail.component.html',
  styleUrls: ['app/hero-detail.component.css'],
  
  // template: `
  // <div *ngIf='hero'>
  //   <h2>{{hero.name}} details!</h2>
  //   <div>
  //     <label>id: </label>{{hero.id}}
  //   </div>
  //   <div>
  //     <label>name: </label>
  //     <input [(ngModel)]="hero.name" placeholder="name"/>
  //   </div>
  //   <button (click)="goBack()">Back</button>
  // </div>`
})

export class HeroDetailComponent implements OnInit, OnDestroy {
  @Input()
  hero: Hero;
  selectedHero: Hero;
  sub: any;

  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = +params['id'];
      this.heroService.getHero(id)
        .then(hero => this.hero = hero);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goBack() {
    window.history.back();
  }

}