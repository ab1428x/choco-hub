import { Component, Inject, NgModule } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})


export class AppComponent {
  title = 'choco-hub';

  public activeRouterName = "";

  constructor() { }

  ngOnInit() {

  //  console.log(this.route.data!['pathDesc']);
  }
}
