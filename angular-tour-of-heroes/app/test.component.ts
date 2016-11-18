import {Component, Input, Output, EventEmitter} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'counter',
  template: `
    <div>
     
      <p>
        <ng-content></ng-content>
        Count: {{ count }} - 
        <button (click)="increment()">Increment</button>
        <button (click)="clicked($event)">Event Check</button>
      </p>
      
    </div>
    <div>
      <h2>Wikipedia Search</h2>
      <input type="text" [formControl]="term"/>
      <ul>
        <li *ngFor="let item of items">{{item}}</li>
      </ul>
    </div>
  `
})
export class Counter {
  @Input() count: number = 0;
  @Output() countChange: EventEmitter<number> = new EventEmitter<number>();


  items: number[];
  term = new FormControl();

  constructor() {
    this.items = [1, 2, 3, 4, 5];
    // this.items = [this.term.value, this.term.value, this.term.value];
  }

  increment() {
    this.count++;
    this.countChange.emit(this.count);
  }

  public clicked(event: any) {
    console.log(event);
  }
}