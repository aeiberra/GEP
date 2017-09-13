import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the PopoverDepositPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-deposit',
  templateUrl: 'popover-deposit.html',
})
export class PopoverDepositPage {

  titleDelete:any = Translator.transform2('titleDelete_add_deposit');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_deposit');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverDepositPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  editDeposit(x){
    this.viewCtrl.dismiss(x);
  }

  deleteDeposit(x){
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
  listDeposit(x){
    this.viewCtrl.dismiss(x, "list");
  }

}
