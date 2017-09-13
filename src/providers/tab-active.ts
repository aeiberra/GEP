import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TabActive {
  public tabActive:any;
  public nameTab:any;

  constructor() {
    console.log('Hello TabActive Provider');
    this.tabActive=0;
    this.nameTab='Home';
  }

  changeTab(x,y) {
    this.tabActive = x;
    this.nameTab = y;
  }

}
