import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AngularFireDatabase} from "angularfire2/database";
import {HttpProvider} from "../../providers/http";

/**
 * Generated class for the PopoverBranchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-branch',
  templateUrl: 'popover-branch.html',
})
export class PopoverBranchPage {

  titleDelete:any = Translator.transform2('titleDelete_add_branch');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_branch');

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private db: AngularFireDatabase,
              private http: HttpProvider) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverBranchPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  editBranch(x){
    this.viewCtrl.dismiss(x);
  }

  deleteBranch(x){
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
            this.db.object('GEP/branchs/'+x.key).remove().then(x => {
              this.close();
            });
          }
        }]
    });
    alert.present();
  }

  generateBranchToken(x){
    this.http.branchToken = null;
    let data = {
      code: x.code,
      name: localStorage.getItem('name'),
      key: x.key
    };
    this.http.generateBranchToken(data);
    this.http.branchToken.subscribe(x=>{
      if(x && x != 'null'){
        let alert = this.alertCtrl.create({
          title: 'Token',
          subTitle: x,
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }

}
