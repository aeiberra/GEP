import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import { NgForm } from '@angular/forms';

import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {PopoverImageDepositPage} from "../popover-image-deposit/popover-image-deposit";
import {LoadingProvider} from "../../providers/loading/loading";
import {PopoverArticlePage} from "../popover-article/popover-article";
import {AddArticlePage} from "../add-article/add-article";


@IonicPage()
@Component({
  selector: 'page-add-deposit',
  templateUrl: 'add-deposit.html',
})
export class AddDepositPage {
  @Input() folder: string;

  title:any;

  deposits:FirebaseListObservable<any[]>;

  keyDeposit:any;
  codeDeposit:any;
  nameDeposit:any;
  photoDeposit:any = '../../assets/icon/deposit.png';
  descriptionDeposit:any;
  articlesDeposit:any;

  title_alert:any;
  subTitle_alert:any;

  searchQuery: string = '';
  articles:FirebaseListObservable<any[]>;
  public articlesList:Array<any>;
  public loadedArticlesList:Array<any>;

  name:string;
  data1:any;
  cropperSettings1:CropperSettings;

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private db: AngularFireDatabase, private alertCtrl: AlertController,
              public firebaseApp: FirebaseApp, public popoverCtrl: PopoverController,
              public loadingProvider: LoadingProvider) {
    if(navParams.data.depositSelected){
      this.title = Translator.transform2('titleEdit_add_deposit');

      let deposit = navParams.data.depositSelected;

      if(deposit.key)         this.keyDeposit = deposit.key;
      if(deposit.code)        this.codeDeposit = deposit.code;
      if(deposit.name)        this.nameDeposit = deposit.name;
      if(deposit.image)       this.photoDeposit = deposit.image.path;
      if(deposit.description) this.descriptionDeposit = deposit.description;
      if(deposit.articles)    this.articlesDeposit = deposit.articles;

    } else this.title = Translator.transform2('titleAdd_add_deposit');

    this.title_alert = Translator.transform2('title_saveAlert');
    this.subTitle_alert = Translator.transform2('subTitle_saveAlert');

    this.name = 'Angular2';
    this.cropperSettings1 = new CropperSettings();
    this.cropperSettings1.width = 300;
    this.cropperSettings1.height = 300;
    this.cropperSettings1.croppedWidth = 300;
    this.cropperSettings1.croppedHeight = 300;
    this.cropperSettings1.canvasWidth = 300;
    this.cropperSettings1.canvasHeight = 300;
    this.cropperSettings1.minWidth = 75;
    this.cropperSettings1.minHeight = 75;
    this.cropperSettings1.rounded = true;
    this.cropperSettings1.keepAspect = true;
    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(222,222,222,1)';
    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;
    this.data1 = {};
  }

  upload(key) {
    if(this.data1 && this.data1.image){
      // Create a root reference
      let storageRef = this.firebaseApp.storage().ref();
      // Make local copies of services because "this" will be clobbered
      let af = this.db;
      let folder = this.folder;
      let path = `/${this.folder}/${key}`;
      let iRef = storageRef.child(path);
      iRef.putString(this.data1.image.split(',')[1], 'base64').then((snapshot) => {
        iRef.getDownloadURL().then(url => {
          af.list(`/${folder}`).update('/image/',{ path: url, filename: key })
        });
      });
    }
  }

  ngOnInit() {
    this.deposits = this.db.list('GEP/deposit');

    // Load Articles
    this.loadingProvider.loadingPresent();
    this.articles = this.db.list('GEP/products', {
      query: {
        orderByChild: 'code'
      }
    });
    this.articles.subscribe(itemList=>{
      let articles = [];

      itemList.forEach( item => {
        if(this.articlesDeposit){
          for(let i in this.articlesDeposit){
            if(item.key == this.articlesDeposit[i].key){
              item.cant = this.articlesDeposit[i].cant
            }
          }
        }
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

  onSubmit(f: NgForm) {
    let articleDeposit:any = [];
    if(this.articlesList){
      for(let i in this.articlesList){
        if(this.articlesList[i].cant > 0){
          articleDeposit.push({
            key: this.articlesList[i].key,
            cant: this.articlesList[i].cant
          })
        }
      }
    }



    if(f.valid && !this.navParams.data.depositSelected){
      let c = f.value;
      let key = this.deposits.push({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        articles: articleDeposit || null,
      }).key;
      this.folder = '/GEP/deposit/'+key;
      this.upload(key);
      this.deposits.update(key,{
        key: key,
      }).then(x => {
        this.navCtrl.pop();
      });
    } else if (f.valid && this.navParams.data.depositSelected){
      let c = f.value;
      this.db.object('GEP/deposit/' + this.keyDeposit).update({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        articles: articleDeposit || null,
      });
      this.folder = '/GEP/deposit/'+this.keyDeposit;
      this.upload(this.keyDeposit);
      this.navCtrl.pop();
    } else if(f.invalid) {
      let alert = this.alertCtrl.create({
        title: this.title_alert,
        subTitle: this.subTitle_alert,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  openImage(){
    let photo = this.photoDeposit;
    let popover = this.popoverCtrl.create(PopoverImageDepositPage, [{photo:photo}], {cssClass: 'deposit-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){
        this.data1 = popoverData;
        this.photoDeposit = popoverData.image;
      }
    })
  }

}
