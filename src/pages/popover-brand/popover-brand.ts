import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the PopoverBrandPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-brand',
  templateUrl: 'popover-brand.html',
})
export class PopoverBrandPage {

  titleDelete:any = Translator.transform2('titleDelete_add_brand');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_brand');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverBrandPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  editBrand(x){
    this.viewCtrl.dismiss(x);
  }

  deleteBrand(x){
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
            this.db.object('GEP/brands/'+x.key).remove().then(x => {
              this.close();
            });
          }
        }]
    });
    alert.present();
  }

}
