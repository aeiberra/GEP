import { Component } from '@angular/core';
import {   AlertController, IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';

import {AddArticlePage} from "../add-article/add-article";
import {PopoverArticlePage} from "../popover-article/popover-article";
import {LoadingProvider} from "../../providers/loading/loading";
import {FirebaseApp} from "angularfire2";


@IonicPage()
@Component({
  selector: 'page-articulo',
  templateUrl: 'article.html',
})
export class ArticlePage {
  searchQuery: string = '';
  articles:FirebaseListObservable<any[]>;
  test:any;
  public articlesList:Array<any>;
  public loadedArticlesList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_article');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_article');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider, public f: FirebaseApp) {

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.articles = this.db.list('GEP/products', {
      query: {
        orderByChild: 'code'
      }
    });
    this.articles.subscribe(itemList=>{
      let articles = [];

      itemList.forEach( item => {
        articles.push(item);
        return false;
      });
      this.articlesList = articles;
      this.loadedArticlesList = articles;
      this.loadingProvider.loadingDismiss();
    });
  }

  ionViewDidLoad() {

  }

  addArticle(){
    this.navCtrl.push(AddArticlePage);
  }

  viewArticle(event, x:any) {
    let popover = this.popoverCtrl.create(PopoverArticlePage,x, {cssClass: 'article-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editArticle(popoverData);
    })
  }

  editArticle(x){
    this.navCtrl.push(AddArticlePage,{
      articleSelected: x
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
            this.db.object('GEP/products/'+x.key).remove();
          }
        }]
    });
    alert.present();
  }


}
