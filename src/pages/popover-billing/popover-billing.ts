import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the PopoverBillingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-billing',
  templateUrl: 'popover-billing.html',
})
export class PopoverBillingPage {

  titleDelete:any = Translator.transform2('titleDelete_add_billing');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_billing');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverBillingPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  editBilling(x){
    this.viewCtrl.dismiss(x);
  }

  deleteBilling(x){
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
            this.db.object('GEP/deposit/'+x.key).remove().then(x => {
              this.close();
            });
          }
        }]
    });
    alert.present();
  }

}
