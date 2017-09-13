import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import { AddTaxPage } from "../add-tax/add-tax";
import { PopoverTaxPage } from "../popover-tax/popover-tax";
import { LoadingProvider } from "../../providers/loading/loading";

@IonicPage()
@Component({
  selector: 'page-tax',
  templateUrl: 'tax.html',
})
export class TaxPage {
  searchQuery: string = '';
  taxs:FirebaseListObservable<any[]>;
  tax;
  public taxsList:Array<any>;
  public loadedTaxsList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_tax');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_tax');
  loadingData:any = Translator.transform2('loadingData');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider) {

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.taxs = this.db.list('GEP/taxs');

    this.taxs.subscribe(itemList=>{
      let taxs = [];

      itemList.forEach( item => {
        taxs.push(item);
        return false;
      });
      this.taxsList = taxs;
      this.loadedTaxsList = taxs;
      this.loadingProvider.loadingDismiss();
    });
  }

  ionViewDidLoad() {

  }

  addTax(){
    this.navCtrl.push(AddTaxPage);
  }

  viewTax(event, x:any) {
    let popover = this.popoverCtrl.create(PopoverTaxPage,x, {cssClass: 'tax-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editTax(popoverData);
    })
  }

  editTax(x){
    this.navCtrl.push(AddTaxPage,{
      taxSelected: x
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

    this.taxsList = this.taxsList.filter((v) => {
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
    this.taxsList = this.loadedTaxsList;
  }

  deleteTax(x){
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
            this.db.object('GEP/taxs/'+x.key).remove();
          }
        }]
    });
    alert.present();
  }

}
