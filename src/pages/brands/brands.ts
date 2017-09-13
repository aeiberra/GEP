import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddBrandPage} from "../add-brand/add-brand";
import {PopoverBrandPage} from "../popover-brand/popover-brand";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
  selector: 'page-brands',
  templateUrl: 'brands.html',
})
export class BrandsPage {
  searchQuery: string = '';
  brands:FirebaseListObservable<any[]>;
  brand;
  public brandsList:Array<any>;
  public loadedBrandsList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_brand');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_brand');
  loadingData:any = Translator.transform2('loadingData');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider) {

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.brands = this.db.list('GEP/brands');

    this.brands.subscribe(itemList=>{
      let brands = [];

      itemList.forEach( item => {
        brands.push(item);
        return false;
      });
      this.brandsList = brands;
      this.loadedBrandsList = brands;
      this.loadingProvider.loadingDismiss();
    });
  }

  ionViewDidLoad() {

  }

  addBrand(){
    this.navCtrl.push(AddBrandPage);
  }

  viewBrand(event, x:any) {
    let popover = this.popoverCtrl.create(PopoverBrandPage,x, {cssClass: 'brand-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editBrand(popoverData);
    })
  }

  editBrand(x){
    this.navCtrl.push(AddBrandPage,{
      brandSelected: x
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

    this.brandsList = this.brandsList.filter((v) => {
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
    this.brandsList = this.loadedBrandsList;
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
            this.db.object('GEP/brands/'+x.key).remove();
          }
        }]
    });
    alert.present();
  }

}
