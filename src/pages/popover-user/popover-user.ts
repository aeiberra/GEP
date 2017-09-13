import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AngularFireDatabase} from "angularfire2/database";
import {HttpProvider} from "../../providers/http";
import {LoadingProvider} from "../../providers/loading/loading";

/**
 * Generated class for the PopoverUserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-user',
  templateUrl: 'popover-user.html',
})
export class PopoverUserPage {

  titleDelete:any = Translator.transform2('titleDelete_add_user');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_user');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private db: AngularFireDatabase,
              public loadingProvider: LoadingProvider, private http: HttpProvider) {
    this.navParams.data.email = this.navParams.data.email.replace(/{punto}/g,'.');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverUserPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  editUser(x){
    this.viewCtrl.dismiss(x);
  }

  deleteUser(x){
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
              name: localStorage.getItem('name'),
              email: x.email
            };
            this.http.deleteUser(key);
            this.http.userUser.subscribe(y=> {
              y = JSON.parse(y);
              if (y && y.s) {
                this.db.object('GEP/users/'+x.key).remove();
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
