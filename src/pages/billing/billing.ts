import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddBillingPage} from "../add-billing/add-billing";
import {PopoverBillingPage} from "../popover-billing/popover-billing";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
  selector: 'page-billing',
  templateUrl: 'billing.html',
})
export class BillingPage {
  searchQuery: string = '';
  billings:FirebaseListObservable<any[]>;
  billing;
  public billingsList:Array<any>;
  public loadedBillingsList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_billing');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_billing');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider) {

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.billings = this.db.list('GEP/billings');

    this.billings.subscribe(itemList=>{
      let billings = [];

      itemList.forEach( item => {
        billings.push(item);
        return false;
      });
      this.billingsList = billings;
      this.loadedBillingsList = billings;
    });
    this.loadingProvider.loadingDismiss();
  }

  ionViewDidLoad() {

  }

  addBilling(){
    this.navCtrl.push(AddBillingPage);
  }

  viewBilling(event, x:any) {
    let popover = this.popoverCtrl.create(PopoverBillingPage,x, {cssClass: 'billing-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editBilling(popoverData);
    })
  }

  editBilling(x){
    this.navCtrl.push(AddBillingPage,{
      billingSelected: x
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

    this.billingsList = this.billingsList.filter((v) => {
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
    this.billingsList = this.loadedBillingsList;
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
            this.db.object('GEP/billings/'+x.key).remove();
          }
        }]
    });
    alert.present();
  }

}
