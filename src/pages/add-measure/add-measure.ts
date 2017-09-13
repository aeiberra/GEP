import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import { NgForm } from '@angular/forms';

import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {PopoverImageMeasurePage} from "../popover-image-measure/popover-image-measure";


@IonicPage()
@Component({
  selector: 'page-add-measure',
  templateUrl: 'add-measure.html',
})
export class AddMeasurePage {
  @Input() folder: string;

  title:any;

  measures:FirebaseListObservable<any[]>;

  keyMeasure:any;
  codeMeasure:any;
  nameMeasure:any;
  photoMeasure:any = '../../assets/icon/measure.png';
  descriptionMeasure:any;

  title_alert:any;
  subTitle_alert:any;

  name:string;
  data1:any;
  cropperSettings1:CropperSettings;

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private db: AngularFireDatabase, private alertCtrl: AlertController,
              public firebaseApp: FirebaseApp, public popoverCtrl: PopoverController) {
    if(navParams.data.measureSelected){
      this.title = Translator.transform2('titleEdit_add_measure');

      let measure = navParams.data.measureSelected;

      if(measure.key)         this.keyMeasure = measure.key;
      if(measure.code)        this.codeMeasure = measure.code;
      if(measure.name)        this.nameMeasure = measure.name;
      if(measure.image)       this.photoMeasure = measure.image.path;
      if(measure.description) this.descriptionMeasure = measure.description;

    } else this.title = Translator.transform2('titleAdd_add_measure');

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
    this.measures = this.db.list('GEP/measures');
  }

  ionViewDidLoad() {

  }

  onSubmit(f: NgForm) {
    if(f.valid && !this.navParams.data.measureSelected){
      let c = f.value;
      let key = this.measures.push({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
      }).key;
      this.folder = '/GEP/measures/'+key;
      this.upload(key);
      this.measures.update(key,{
        key: key,
      }).then(x => {
        this.navCtrl.pop();
      });
    } else if (f.valid && this.navParams.data.measureSelected){
      let c = f.value;
      this.db.object('GEP/measures/' + this.keyMeasure).update({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
      });
      this.folder = '/GEP/measures/'+this.keyMeasure;
      this.upload(this.keyMeasure);
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
    let photo = this.photoMeasure;
    let popover = this.popoverCtrl.create(PopoverImageMeasurePage, [{photo:photo}], {cssClass: 'measure-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){
        this.data1 = popoverData;
        this.photoMeasure = popoverData.image;
      }
    })
  }

}
