import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the PopoverSalesRSPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-sales-rs',
  templateUrl: 'popover-sales-rs.html',
})
export class PopoverSalesRSPage {

  titleDelete:any = Translator.transform2('titleDelete_add_salesRS');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_salesRS');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverSalesRSPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  editSalesRS(x){
    this.viewCtrl.dismiss(x);
  }

  deleteSalesRS(x){
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
            this.db.object('GEP/salesRS/'+x.key).remove().then(x => {
              this.close();
            });
          }
        }]
    });
    alert.present();
  }

}
