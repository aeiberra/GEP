import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-actualizacion-precios',
  templateUrl: 'actualizacion-precios.html',
})
export class ActualizacionPreciosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActualizacionPreciosPage');
  }

}
