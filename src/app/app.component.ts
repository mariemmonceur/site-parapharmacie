import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '32';

  persons = [
    {
      id: 1,
      name: 'Hardik Savani',
      gender: 0,
      website: 'itsolutionstuff.com'
    },
    {
      id: 2,
      name: 'Kajal Patel',
      gender: 1,
      website: 'nicesnippets.com'
    },
    {
      id: 3,
      name: 'Harsukh Makawana',
      gender: 0,
      website: 'laracode.com'
    }
  ];
}
