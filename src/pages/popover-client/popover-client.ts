import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the PopoverClientPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-client',
  templateUrl: 'popover-client.html',
})
export class PopoverClientPage {

  titleDelete:any = Translator.transform2('titleDelete_add_client');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_client');
  titleDontDelete:any = Translator.transform2('titleDontDelete_add_client');
  subTitleDontDelete:any = Translator.transform2('subTitleDontDelete_add_client');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverClientPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  editClient(x){
    this.viewCtrl.dismiss(x);
  }

  deleteClient(x) {
    let alert;
    if (this.navParams.data.dontDelete) {
      alert = this.alertCtrl.create({
        title: this.titleDontDelete,
        subTitle: this.subTitleDontDelete,
        buttons: [{
          text: 'Cancel',
          handler: data => {
          }
        },
          {
            text: 'Ok',
            handler: data => {
            }
          }]
      });
    } else {
      alert = this.alertCtrl.create({
        title: this.titleDelete,
        subTitle: this.subTitleDelete + ' ' + x.name + ' ' + x.surname + '?',
        buttons: [{
          text: 'Cancel',
          handler: data => {
          }
        },
          {
            text: 'Ok',
            handler: data => {
              this.db.object('GEP/clients/' + x.key).remove().then(x => {
                this.close();
              });
            }
          }]
      });
    }
    alert.present();
  }

}
