import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddSalesRSPage} from "../add-sales-rs/add-sales-rs";
import {PopoverSalesRSPage} from "../popover-sales-rs/popover-sales-rs";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
  selector: 'page-sales-RS',
  templateUrl: 'sales-RS.html',
})
export class SalesRSPage {
  searchQuery: string = '';
  salesRSs:FirebaseListObservable<any[]>;
  salesRS;
  public salesRSsList:Array<any>;
  public loadedSalesRSsList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_salesRS');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_salesRS');
  loadingData:any = Translator.transform2('loadingData');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider) {

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.salesRSs = this.db.list('GEP/salesRS');

    this.salesRSs.subscribe(itemList=>{
      let salesRSs = [];

      itemList.forEach( item => {
        salesRSs.push(item);
        return false;
      });
      this.salesRSsList = salesRSs;
      this.loadedSalesRSsList = salesRSs;
      this.loadingProvider.loadingDismiss();
    });
  }

  ionViewDidLoad() {

  }

  addSalesRS(){
    this.navCtrl.push(AddSalesRSPage);
  }

  viewSalesRS(event, x:any) {
    let popover = this.popoverCtrl.create(PopoverSalesRSPage,x, {cssClass: 'salesRS-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editSalesRS(popoverData);
    })
  }

  editSalesRS(x){
    this.navCtrl.push(AddSalesRSPage,{
      salesRSSelected: x
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

    this.salesRSsList = this.salesRSsList.filter((v) => {
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
    this.salesRSsList = this.loadedSalesRSsList;
  }

  deleteSalesRS(x){
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
            this.db.object('GEP/salesRS/'+x.key).remove();
          }
        }]
    });
    alert.present();
  }

}
