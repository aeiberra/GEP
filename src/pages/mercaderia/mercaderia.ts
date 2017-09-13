import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-mercaderia',
  templateUrl: 'mercaderia.html'
})
export class MercaderiaTab {

  constructor(public navCtrl: NavController) {
  }
  goToOtherPage() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    // this.navCtrl.push(this.articlePage);
  }
}
