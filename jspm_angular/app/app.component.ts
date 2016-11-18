import { Component } from 'angular2/core';

@Component ({
  selector : 'app',
  template : `
  <p> Hello world Test !!!</p>
  `
})

export class AppComponent {
  constructor () {
    console.log(this);
  }
}