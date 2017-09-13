import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import { NgForm } from '@angular/forms';

import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';


@IonicPage()
@Component({
  selector: 'page-add-tax',
  templateUrl: 'add-tax.html',
})
export class AddTaxPage {
  @Input() folder: string;

  title:any;

  taxs:FirebaseListObservable<any[]>;

  keyTax:any;
  codeTax:any;
  nameTax:any;
  descriptionTax:any;
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
    if(navParams.data.taxSelected){
      this.title = Translator.transform2('titleEdit_add_tax');

      let tax = navParams.data.taxSelected;

      if(tax.key)         this.keyTax = tax.key;
      if(tax.code)        this.codeTax = tax.code;
      if(tax.name)        this.nameTax = tax.name;
      if(tax.description) this.descriptionTax = tax.description;
      if(tax.type)        this.type = tax.type;
      if(tax.value)       this.value = tax.value;

    } else this.title = Translator.transform2('titleAdd_add_tax');

    this.title_alert = Translator.transform2('title_saveAlert');
    this.subTitle_alert = Translator.transform2('subTitle_saveAlert');
  }

  ngOnInit() {
    this.taxs = this.db.list('GEP/taxs');
  }

  ionViewDidLoad() {

  }

  onSubmit(f: NgForm) {
    if(f.valid && !this.navParams.data.taxSelected){
      let c = f.value;
      let key = this.taxs.push({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        type: this.type || null,
        value: c.value || null
      }).key;
      this.folder = '/GEP/taxs/'+key;
      this.taxs.update(key,{
        key: key,
      }).then(x => {
        this.navCtrl.pop();
      });
    } else if (f.valid && this.navParams.data.taxSelected){
      let c = f.value;
      this.db.object('GEP/taxs/' + this.keyTax).update({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        type: this.type || null,
        value: c.value || null
      });
      this.folder = '/GEP/taxs/'+this.keyTax;
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

}
