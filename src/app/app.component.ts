import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = {
    text: 'angular-universal-v9',
    link: 'https://otter.ai',
    color: '#f00'
  };

  onClick(event: MouseEvent) {
    console.log((event.target as any)._data);
  }
}
