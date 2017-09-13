import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import { NgForm } from '@angular/forms';

import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {PopoverImageArticlePage} from "../popover-image-article/popover-image-article";
import {AddFamilyPage} from "../add-family/add-family";
import {PopoverBrandRelationsPage} from "../popover-brand-relations/popover-brand-relations";
import {PopoverMeasureRelationsPage} from "../popover-measure-relations/popover-measure-relations";
import {AddMeasurePage} from "../add-measure/add-measure";


@IonicPage()
@Component({
  selector: 'page-add-article',
  templateUrl: 'add-article.html',
})
export class AddArticlePage {
  @Input() folder: string;

  title:any;

  articles:FirebaseListObservable<any[]>;
  family:FirebaseListObservable<any[]>;
  selectFamily:any;
  familyHeaders:any = [];
  currentFamily:any;
  addedFamily:any = [];

  relationBrand:any;
  relationMeasure:any;
  currentSecondMeasure:any;
  addedSecondMeasure:any = [];
  relationMeasureSecondary:any;

  keyArticle:any;
  codeArticle:any;
  nameArticle:any;
  barCodeArticle:any;
  photoArticle:any = '../../assets/icon/product.png';
  descriptionArticle:any;
  netCostArticle:any;
  weightArticle:any;
  familyArticle:any;
  type:any;
  value:any;

  title_alert:any;
  subTitle_alert:any;

  name:string;
  data1:any;
  cropperSettings1:CropperSettings;

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private db: AngularFireDatabase, private alertCtrl: AlertController,
              public firebaseApp: FirebaseApp, public popoverCtrl: PopoverController) {
    if(navParams.data.articleSelected){ //Verifico si es un articulo nuevo o se edita uno
      this.title = Translator.transform2('titleEdit_add_article');

      let article = navParams.data.articleSelected;

      if(article.key)               this.keyArticle = article.key;
      if(article.code)              this.codeArticle = article.code;
      if(article.name)              this.nameArticle = article.name;
      if(article.barCode)           this.barCodeArticle = article.barCode;
      if(article.image)             this.photoArticle = article.image.path;
      if(article.description)       this.descriptionArticle = article.description;
      if(article.netCost)           this.netCostArticle = article.netCost;
      if(article.weight)            this.weightArticle = article.weight;
      if(article.family)            this.familyArticle = article.family;
      if(article.brand)             this.relationBrand = article.brand;
      if(article.measurePrincipal)  this.relationMeasure = article.measurePrincipal;
      if(article.measureSecondary)  this.relationMeasureSecondary = article.measureSecondary;
      if(article.type)              this.type = article.type;
      if(article.value)             this.value = article.value;

    } else this.title = Translator.transform2('titleAdd_add_article');

    this.title_alert = Translator.transform2('title_saveAlert');
    this.subTitle_alert = Translator.transform2('subTitle_saveAlert');

    // Crop
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

    // Obtengo todas las familias relacionadas
    if(this.familyArticle){
      this.familyHeaders = [];
      this.db.app.database().ref('GEP/family').orderByChild("relation/key").equalTo(this.familyArticle).once('value', y => {
        for (let i in y.val()) {
          this.familyHeaders.push(y.val()[i]);
        }
      });
      this.currentFamily = this.familyHeaders;
      this.search(this.familyArticle);
    } else this.addFamily();

    // Obtengo todas las Equivalencias
    if(this.relationMeasureSecondary){
      for(let i in this.relationMeasureSecondary){
        this.db.app.database().ref('GEP/measures').child('/'+this.relationMeasureSecondary[i].key).once('value', x =>{
          if(x.val()){
            let y = x.val();
            y.cant = this.relationMeasureSecondary[i].cant;
            this.addedSecondMeasure.push(y)
          }
        })
      }
      this.secondMeasureList();
    }
  }

  // Mas Familias
  search(key){
    this.db.app.database().ref('GEP/family').orderByChild("key").equalTo(key).once('value', y => {
      this.addedFamily.push(y.val()[key]);
      if (y.val()[key].relation.key) {
        key = y.val()[key].relation.key;
        this.search(key);
      } else {
        this.addedFamily.reverse();
      }
    });
  };

  // Cargar Imagen
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
    this.articles = this.db.list('GEP/products');
    this.family = this.db.list('GEP/family');
  }

  ionViewDidLoad() {

  }

  // Guardar/Editar
  onSubmit(f: NgForm) {
    let addedFamily;
    if(this.addedFamily.length > 0){
      addedFamily = this.addedFamily[this.addedFamily.length - 1].key
    }
    let addedBrand:any={};
    if(this.relationBrand){
      addedBrand.name = this.relationBrand.name;
      addedBrand.key = this.relationBrand.key;
    }
    let addedMeasure:any={};
    if(this.relationMeasure){
      addedMeasure.name = this.relationMeasure.name;
      addedMeasure.key = this.relationMeasure.key;
    }
    let addedSecondMeasure:any = [];
    if(this.addedSecondMeasure.length > 0){
      for(let i in this.addedSecondMeasure){
        addedSecondMeasure.push({key: this.addedSecondMeasure[i].key,cant: this.addedSecondMeasure[i].cant});
      }
    }
    if(f.valid && !this.navParams.data.articleSelected){
      let c = f.value;
      let key = this.articles.push({
        code: c.code || null,
        name: c.name || null,
        barCode: c.barCode || null,
        description: c.description || null,
        netCost: c.netCost || null,
        weight: c.weight || null,
        family:  addedFamily || null,
        brand: addedBrand || null,
        measurePrincipal: addedMeasure || null,
        measureSecondary: addedSecondMeasure || null,
        type: this.type || null,
        value: c.value || null
      }).key;
      this.folder = '/GEP/products/'+key;
      this.upload(key);
      this.articles.update(key,{
        key: key,
      }).then(x => {
        this.navCtrl.pop();
      });
    } else if (f.valid && this.navParams.data.articleSelected){
      let c = f.value;
      this.db.object('GEP/products/' + this.keyArticle).update({
        code: c.code || null,
        name: c.name || null,
        barCode: c.barCode || null,
        description: c.description || null,
        netCost: c.netCost || null,
        weight: c.weight || null,
        family: addedFamily || null,
        brand: addedBrand || null,
        measurePrincipal: addedMeasure || null,
        measureSecondary: addedSecondMeasure || null,
        type: this.type || null,
        value: c.value || null
      });
      this.folder = '/GEP/products/'+this.keyArticle;
      this.upload(this.keyArticle);
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

  // Cuadro de Dialogo de IMagen
  openImage(){
    let photo = this.photoArticle;
    let popover = this.popoverCtrl.create(PopoverImageArticlePage, [{photo:photo}], {cssClass: 'article-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){
        this.data1 = popoverData;
        this.photoArticle = popoverData.image;
      }
    })
  }

  // Agregar Familia
  addFamily(){
    this.familyHeaders = [];
    this.db.app.database().ref('GEP/family').orderByChild("relation").equalTo("false").once('value', x =>{
      for(let i in x.val()){
        this.familyHeaders.push(x.val()[i]);
      }
    });
    this.currentFamily = this.familyHeaders;
  }

  pushFamily(x){
    this.selectFamily = null;
    this.addedFamily.push(x);
    this.familyHeaders = [];
    this.db.app.database().ref('GEP/family').orderByChild("relation/key").equalTo(x.key).once('value', y =>{
      for(let i in y.val()){
        this.familyHeaders.push(y.val()[i]);
      }
    });
    this.currentFamily = this.familyHeaders;
  }

  deleteFamily(f,i){
    this.addedFamily.splice(i);
    if(f.relation.key){
      this.familyHeaders = [];
      this.db.app.database().ref('GEP/family').orderByChild("relation/key").equalTo(f.relation.key).once('value', y =>{
        for(let i in y.val()){
          this.familyHeaders.push(y.val()[i]);
        }
      });
      this.currentFamily = this.familyHeaders;
    } else this.addFamily()
  }

  newFamily(){
    this.navCtrl.push(AddFamilyPage)
  }

  // Agregar Marca
  viewRelationsBrand(x) {
    let popover = this.popoverCtrl.create(PopoverBrandRelationsPage, [{brand:x}], {cssClass: 'brand-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){this.relationBrand = popoverData};
    })
  }

  // Agregar Medida principal
  viewRelationsMeasure(x) {
    let popover = this.popoverCtrl.create(PopoverMeasureRelationsPage, [{measure:x}], {cssClass: 'measure-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){
        this.relationMeasure = popoverData;
        this.addedSecondMeasure = [];
        this.secondMeasureList();
      }
    })
  }

  // Agregar Equivalencias
  secondMeasureList(){
    this.currentSecondMeasure = [];
    this.db.app.database().ref('GEP/measures').once('value', x =>{
      for(let i in x.val()){
        if(this.relationMeasure && this.relationMeasure.key != x.val()[i].key){
          let exist = false;
          for(let j in this.addedSecondMeasure){
            if(this.addedSecondMeasure[j].key == x.val()[i].key){
              exist = true;
            }
          }
          if(!exist) this.currentSecondMeasure.push(x.val()[i]);
        }
      }
    });
  }

  addSecondMeasure(){
    this.db.app.database().ref('GEP/measures').orderByKey().limitToLast(1).on("child_changed", x => {
        this.currentSecondMeasure.push(x.val());
    })
  }

  pushSecondMeasure(c, j){
    c.cant = 1;
    this.addedSecondMeasure.push(c);
    this.currentSecondMeasure.splice(j, 1);
  }

  deleteSecondMeasure(c,i){
    this.currentSecondMeasure.push(c);
    this.addedSecondMeasure.splice(i, 1);
  }

  newSecondMeasure(){
    this.navCtrl.push(AddMeasurePage)
  }

}
