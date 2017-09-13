import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the PopoverArticlePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-article',
  templateUrl: 'popover-article.html',
})
export class PopoverArticlePage {

  titleDelete:any = Translator.transform2('titleDelete_add_article');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_article');
  titleDontDelete:any = Translator.transform2('titleDontDelete_add_article');
  subTitleDontDelete:any = Translator.transform2('subTitleDontDelete_add_article');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverArticlePage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  editArticle(x){
    this.viewCtrl.dismiss(x);
  }

  deleteArticle(x){
    let alert;
    if (this.navParams.data.dontDelete){
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
        subTitle: this.subTitleDelete + ' '+ x.name + '?',
        buttons: [{
          text: 'Cancel',
          handler: data => {
          }
        },
          {
            text: 'Ok',
            handler: data => {
              this.db.object('GEP/products/'+x.key).remove().then(x => {
                this.close();
              });
            }
          }]
      });
    }
    alert.present();
  }

}
