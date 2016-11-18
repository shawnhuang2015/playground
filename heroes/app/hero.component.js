"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var hero_detail_component_1 = require('./hero-detail.component');
var hero_service_1 = require('./hero.service');
var router_1 = require('@angular/router');
var HeroComponent = (function () {
    function HeroComponent(heroService, router) {
        this.heroService = heroService;
        this.router = router;
        this.title = 'Test of heroes';
        // this.getHeroes();
        // console.log('1')
    }
    HeroComponent.prototype.onSelect = function (hero) {
        this.selectedHero = hero;
    };
    HeroComponent.prototype.getHeroes = function () {
        this.heroService.getHeroes().then(function (heroes) {
            this.heroes = heroes;
        }.bind(this));
    };
    HeroComponent.prototype.ngOnInit = function () {
        // this.getHeroes();
        this.getHeroes();
        // console.log('1')
    };
    HeroComponent.prototype.gotoDetail = function () {
        this.router.navigate(['/detail', this.selectedHero.id]);
    };
    HeroComponent = __decorate([
        core_1.Component({
            selector: 'my-hero',
            templateUrl: 'app/heroes.component.html',
            styleUrls: ['app/heroes.component.css'],
            directives: [hero_detail_component_1.HeroDetailComponent]
        }), 
        __metadata('design:paramtypes', [hero_service_1.HeroService, router_1.Router])
    ], HeroComponent);
    return HeroComponent;
}());
exports.HeroComponent = HeroComponent;
//# sourceMappingURL=hero.component.js.map