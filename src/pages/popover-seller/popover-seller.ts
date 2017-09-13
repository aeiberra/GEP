import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AngularFireDatabase} from "angularfire2/database";
import {HttpProvider} from "../../providers/http";
import {LoadingProvider} from "../../providers/loading/loading";

/**
 * Generated class for the PopoverSellerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-seller',
  templateUrl: 'popover-seller.html',
})
export class PopoverSellerPage {

  titleDelete:any = Translator.transform2('titleDelete_add_seller');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_seller');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private db: AngularFireDatabase,
              public loadingProvider: LoadingProvider, private http: HttpProvider) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverSellerPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  editSeller(x){
    this.viewCtrl.dismiss(x);
  }

  deleteSeller(x){
    let alert = this.alertCtrl.create({
      title: this.titleDelete,
      subTitle: this.subTitleDelete + ' '+ x.name + ' ' + x.surname +'?',
      buttons: [{
        text: 'Cancel',
        handler: data => {
        }
      },
        {
          text: 'Ok',
          handler: data => {
            this.loadingProvider.loadingPresent();
            setTimeout(()=>{
              this.loadingProvider.loadingDismiss();
            },7000);
            let key = {
              key: x.key,
              name: localStorage.getItem('name')
            };
            this.http.deleteSellerUser(key);
            this.http.sellerUser.subscribe(y=> {
              y = JSON.parse(y);
              if (y && y.s) {
                this.db.object('GEP/sellers/'+x.key).remove();
                this.loadingProvider.loadingDismiss();
                this.close();
              } else if(y && y.e) {
                let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: y.e.message,
                  buttons: ['OK']
                });
                alert.present();
                this.loadingProvider.loadingDismiss();
                this.close();
              }
            });
          }
        }]
    });
    alert.present();
  }

}
