import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the PopoverPriceListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-price-list',
  templateUrl: 'popover-price-list.html',
})
export class PopoverPriceListPage {

  titleDelete:any = Translator.transform2('titleDelete_add_priceList');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_priceList');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverPriceListPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  editPriceList(x){
    this.viewCtrl.dismiss(x);
  }

  deletePriceList(x){
    let alert = this.alertCtrl.create({
      title: this.titleDelete,
      subTitle: this.subTitleDelete + ' '+ x.name + '?',
      buttons: [{
        text: 'Cancel',
        handler: data => {
        }
      },
        {
          text: 'Ok',
          handler: data => {
            this.db.object('GEP/price-lists/'+x.key).remove().then(x => {
              this.close();
            });
          }
        }]
    });
    alert.present();
  }
  listListPrice(x){
    this.viewCtrl.dismiss(x, "list");
  }

}
