import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import { NgForm } from '@angular/forms';

import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {PopoverImageFamilyPage} from "../popover-image-family/popover-image-family";
import {PopoverFamilyRelationsPage} from "../popover-family-relations/popover-family-relations";


@IonicPage()
@Component({
  selector: 'page-add-family',
  templateUrl: 'add-family.html',
})
export class AddFamilyPage {
  @Input() folder: string;

  title:any;

  familys:FirebaseListObservable<any[]>;

  relation:any;

  keyFamily:any;
  codeFamily:any;
  nameFamily:any;
  photoFamily:any = '../../assets/icon/family.png';
  descriptionFamily:any;
  relationFamily:any;

  title_alert:any;
  subTitle_alert:any;

  name:string;
  data1:any;
  cropperSettings1:CropperSettings;

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private db: AngularFireDatabase, private alertCtrl: AlertController,
              public firebaseApp: FirebaseApp, public popoverCtrl: PopoverController) {
    if(navParams.data.familySelected){
      this.title = Translator.transform2('titleEdit_add_family');

      let family = navParams.data.familySelected;

      if(family.key)            this.keyFamily = family.key;
      if(family.code)           this.codeFamily = family.code;
      if(family.name)           this.nameFamily = family.name;
      if(family.image)          this.photoFamily = family.image.path;
      if(family.description)    this.descriptionFamily = family.description;
      if(family.relation){
        if(family.relation.name)  this.relationFamily = family.relation.name;
        if(family.relation.key){
          this.relation = {};
          this.relation.name = this.relationFamily;
          this.relation.key = family.relation.key;
        }
      }

    } else this.title = Translator.transform2('titleAdd_add_family');

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
    this.familys = this.db.list('GEP/family');
  }

  ionViewDidLoad() {

  }

  onSubmit(f: NgForm) {
    let relationSubmit:any;
    if(!this.relation){
      relationSubmit = "false";
    } else{
      relationSubmit = {};
      relationSubmit.key = this.relation.key;
      relationSubmit.name = this.relation.name;
    }
    if(f.valid && !this.navParams.data.familySelected){
      let c = f.value;
      let key = this.familys.push({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        relation: relationSubmit || null
      }).key;
      this.folder = '/GEP/family/'+key;
      this.upload(key);
      this.familys.update(key,{
        key: key,
      }).then(x => {
        this.navCtrl.pop();
      });
    } else if (f.valid && this.navParams.data.familySelected){
      let c = f.value;
      this.db.object('GEP/family/' + this.keyFamily).update({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        relation: relationSubmit || null
      });
      this.folder = '/GEP/family/'+this.keyFamily;
      this.upload(this.keyFamily);
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
    let photo = this.photoFamily;
    let popover = this.popoverCtrl.create(PopoverImageFamilyPage, [{photo:photo}], {cssClass: 'family-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){
        this.data1 = popoverData;
        this.photoFamily = popoverData.image;
      }
    })
  }

  viewRelations(x) {
    let popover = this.popoverCtrl.create(PopoverFamilyRelationsPage, [{family:x,key:this.keyFamily}], {cssClass: 'family-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){this.relation = popoverData};
    })
  }

}
