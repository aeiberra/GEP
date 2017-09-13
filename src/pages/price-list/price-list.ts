import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddPriceListPage} from "../add-price-list/add-price-list";
import {PopoverPriceListPage} from "../popover-price-list/popover-price-list";
import {LoadingProvider} from "../../providers/loading/loading";
import {PriceListListPage} from "../price-list-list/price-list-list";

@IonicPage()
@Component({
  selector: 'page-price-list',
  templateUrl: 'price-list.html',
})
export class PriceListPage {
  searchQuery: string = '';
  priceLists:FirebaseListObservable<any[]>;
  priceList;
  public priceListsList:Array<any>;
  public loadedPriceListsList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_priceList');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_priceList');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider) {

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.priceLists = this.db.list('GEP/price-lists');

    this.priceLists.subscribe(itemList=>{
      let priceLists = [];

      itemList.forEach( item => {
        priceLists.push(item);
        return false;
      });
      this.priceListsList = priceLists;
      this.loadedPriceListsList = priceLists;
    });
    this.loadingProvider.loadingDismiss();
  }

  ionViewDidLoad() {

  }

  addPriceList(){
    this.navCtrl.push(AddPriceListPage);
  }

  viewPriceList(event, x:any) {
    let popover = this.popoverCtrl.create(PopoverPriceListPage,x, {cssClass: 'priceList-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData, y) => {
      if(y) this.listPriceList(popoverData); else
      if(popoverData) this.editPriceList(popoverData);
    })
  }

  editPriceList(x){
    this.navCtrl.push(AddPriceListPage,{
      priceListSelected: x
    });
  }

  listPriceList(x){
    this.navCtrl.push(PriceListListPage,{
      priceListSelected: x
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

    this.priceListsList = this.priceListsList.filter((v) => {
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
    this.priceListsList = this.loadedPriceListsList;
  }

  deletePriceList(x){
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
            this.db.object('GEP/price-lists/'+x.key).remove();
          }
        }]
    });
    alert.present();
  }

}
