"use strict";
var router_1 = require('@angular/router');
var hero_component_1 = require('./hero.component');
var dashboard_component_1 = require('./dashboard.component');
var hero_detail_component_1 = require('./hero-detail.component');
var routes = [
    {
        path: 'hero',
        component: hero_component_1.HeroComponent
    },
    {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent,
        pathMatch: 'full'
    },
    {
        path: 'detail/:id',
        component: hero_detail_component_1.HeroDetailComponent
    }
];
exports.appRouterProviders = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=app.routes.js.map