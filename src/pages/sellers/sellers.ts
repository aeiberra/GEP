import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';

import { AddSellerPage } from "../add-seller/add-seller";
import {PopoverSellerPage} from "../popover-seller/popover-seller";
import {LoadingProvider} from "../../providers/loading/loading";
import {HttpProvider} from "../../providers/http";

@IonicPage()
@Component({
  selector: 'page-selleres',
  templateUrl: 'sellers.html',
})
export class SellersPage {
  searchQuery: string = '';
  sellers:FirebaseListObservable<any[]>;
  seller;
  public sellersList:Array<any>;
  public loadedSellersList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_seller');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_seller');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider, private http: HttpProvider) {

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.sellers = this.db.list('GEP/sellers');

    this.sellers.subscribe(itemList=>{
      let sellers = [];

      itemList.forEach( item => {
        sellers.push(item);
        return false;
      });
      this.sellersList = sellers;
      this.loadedSellersList = sellers;
    });
    this.loadingProvider.loadingDismiss();
  }

  ionViewDidLoad() {

  }

  addSeller(){
    this.navCtrl.push(AddSellerPage);
  }

  viewSeller(event, x:any) {
    // this.navCtrl.push(AddSellerPage,{
    //   sellerSelected: x
    // });
    let popover = this.popoverCtrl.create(PopoverSellerPage,x, {cssClass: 'seller-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editSeller(popoverData);
    })
  }

  editSeller(x){
    this.navCtrl.push(AddSellerPage,{
      sellerSelected: x
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

    this.sellersList = this.sellersList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1 || (v.surname && v.surname.toLowerCase().indexOf(q.toLowerCase()) > -1)
          || (v.phone && v.phone.toLowerCase().indexOf(q.toLowerCase()) > -1) || (v.code && v.code.toLowerCase().indexOf(q.toLowerCase()) > -1)
          ) {
          return true;
        }
        return false;
      }
    });
  }

  initializeItems(): void {
    this.sellersList = this.loadedSellersList;
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
              } else if(y && y.e) {
                let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: y.e.message,
                  buttons: ['OK']
                });
                alert.present();
                this.loadingProvider.loadingDismiss();
              }
            });
          }
        }]
    });
    alert.present();
  }

}
