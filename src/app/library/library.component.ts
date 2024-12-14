import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss'],
    standalone: false
})
export class LibraryComponent implements OnInit {

  private piListenerUrl = environment.piListenerLibUrl;
  private proxyurl = environment.proxyurl;
  public titlesList: string[] = [];

  private piListenerCapUrl = environment.piListenerCapUrl;
  public capsList: string[] = [];

  constructor() { }

  ngOnInit(): void {

    var fullPath = this.proxyurl + this.piListenerUrl + '/1';

    fetch(fullPath).then(data => {
      data.text().then(res => {
        this.titlesList = res.split("\n");
        this.titlesList = this.titlesList.filter(x => x.length > 0);
      });
    })

    var fullPathCap = this.proxyurl + this.piListenerCapUrl;

    fetch(fullPathCap).then(data => {
      data.text().then(res => {
        this.capsList = res.split("\n");
        this.capsList = this.capsList.filter(x => x.length > 0);
      });
    })
  }

}
