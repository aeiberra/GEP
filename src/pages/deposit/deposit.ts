import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddDepositPage} from "../add-deposit/add-deposit";
import {PopoverDepositPage} from "../popover-deposit/popover-deposit";
import {LoadingProvider} from "../../providers/loading/loading";
import {DepositListPage} from "../deposit-list/deposit-list";

@IonicPage()
@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {
  searchQuery: string = '';
  deposits:FirebaseListObservable<any[]>;
  deposit;
  public depositsList:Array<any>;
  public loadedDepositsList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_deposit');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_deposit');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider) {

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.deposits = this.db.list('GEP/deposit');

    this.deposits.subscribe(itemList=>{
      let deposits = [];

      itemList.forEach( item => {
        deposits.push(item);
        return false;
      });
      this.depositsList = deposits;
      this.loadedDepositsList = deposits;
    });
    this.loadingProvider.loadingDismiss();
  }

  ionViewDidLoad() {

  }

  addDeposit(){
    this.navCtrl.push(AddDepositPage);
  }

  viewDeposit(event, x:any) {
    let popover = this.popoverCtrl.create(PopoverDepositPage,x, {cssClass: 'deposit-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData, y) => {
      if(y) this.listDeposit(popoverData); else
      if(popoverData) this.editDeposit(popoverData);
    })
  }

  editDeposit(x){
    this.navCtrl.push(AddDepositPage,{
      depositSelected: x
    });
  }

  listDeposit(x){
    this.navCtrl.push(DepositListPage,{
      depositSelected: x
    });
  }

  getItems(searchBar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    let q = searchBar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.depositsList = this.depositsList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1 || (v.code && v.code.toLowerCase().indexOf(q.toLowerCase()) > -1)
            || (v.description && v.description.toLowerCase().indexOf(q.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
    });
  }

  initializeItems(): void {
    this.depositsList = this.loadedDepositsList;
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
            this.db.object('GEP/deposit/'+x.key).remove();
          }
        }]
    });
    alert.present();
  }

}
