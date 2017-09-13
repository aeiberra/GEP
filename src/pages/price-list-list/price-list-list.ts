import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';

import {PopoverArticlePage} from "../popover-article/popover-article";
import {LoadingProvider} from "../../providers/loading/loading";
import {AddPriceListPage} from "../add-price-list/add-price-list"

@IonicPage()
@Component({
  selector: 'page-price-list-list',
  templateUrl: 'price-list-list.html',
})
export class PriceListListPage {
  searchQuery: string = '';
  articles:FirebaseListObservable<any[]>;
  public articlesList:Array<any>;
  public loadedArticlesList:Array<any>;
  priceLists:any;
  articlesPriceList:any;

  titleDontDelete:any = Translator.transform2('titleDontDelete_add_article');
  subTitleDontDelete:any = Translator.transform2('subTitleDontDelete_add_article');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider) {

  }
  ngOnInit() {
    if(this.navParams.data.priceListSelected.key){
      this.priceLists = this.db.list('GEP/price-lists/'+this.navParams.data.priceListSelected.key+"/articles");
      this.priceLists.subscribe(itemList=> {
        this.articlesPriceList = [];
        itemList.forEach(item => {
          this.articlesPriceList.push(item);
          return false;
        });
      })
    }


    this.loadingProvider.loadingPresent();
    this.articles = this.db.list('GEP/products', {
      query: {
        orderByChild: 'code'
      }
    });
    this.articles.subscribe(itemList=>{
      let articles = [];

      itemList.forEach( item => {
        for(let i in this.articlesPriceList){
          if(item.key == this.articlesPriceList[i].key){
            item.cant = this.articlesPriceList[i].cant;
            articles.push(item);
          }
        }
        return false;
      });
      this.articlesList = articles;
      this.loadedArticlesList = articles;
      this.loadingProvider.loadingDismiss();
    });
  }

  ionViewDidLoad() {

  }

  viewArticle(event, x:any) {
    x.dontDelete = true;
    let popover = this.popoverCtrl.create(PopoverArticlePage,x, {cssClass: 'article-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editArticle();
    })
  }

  editArticle(){
    this.navCtrl.push(AddPriceListPage,{
      priceListSelected: this.navParams.data.priceListSelected
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

    this.articlesList = this.articlesList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1 || (v.code && v.code.toLowerCase().indexOf(q.toLowerCase()) > -1)
          || (v.barCode && v.barCode.toString().toLowerCase().indexOf(q.toLowerCase()) > -1) || (v.description && v.description.toLowerCase().indexOf(q.toLowerCase()) > -1)
          || (v.netCost && v.netCost.toString().toLowerCase().indexOf(q.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
    });
  }

  initializeItems(): void {
    this.articlesList = this.loadedArticlesList;
  }

  deleteArticle(x){
    let alert = this.alertCtrl.create({
      title: this.titleDontDelete,
      subTitle: this.subTitleDontDelete,
      buttons: [{
        text: 'Cancel',
        handler: data => {
        }
      },
        {
          text: 'Ok',
          handler: data => {
          }
        }]
    });
    alert.present();
  }

}
