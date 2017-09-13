import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the PopoverFamilyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-family',
  templateUrl: 'popover-family.html',
})
export class PopoverFamilyPage {

  titleDelete:any = Translator.transform2('titleDelete_add_family');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_family');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverFamilyPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  editFamily(x){
    this.viewCtrl.dismiss(x);
  }

  deleteFamily(x){
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
            this.db.object('GEP/family/'+x.key).remove().then(x => {
              this.close();
            });
          }
        }]
    });
    alert.present();
  }

}
