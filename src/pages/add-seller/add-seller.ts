import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import { NgForm } from '@angular/forms';

import {HttpProvider} from "../../providers/http";

import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {PopoverImageSellerPage} from "../popover-image-seller/popover-image-seller";
import {CryptoProvider} from "../../providers/crypto";
import {LoadingProvider} from "../../providers/loading/loading";


/**
 * Generated class for the AddSellerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-seller',
  templateUrl: 'add-seller.html'
})
export class AddSellerPage {
  @Input() folder: string;

  title:any;

  sellers:FirebaseListObservable<any[]>;

  keySeller:any;
  codeSeller:any;
  nameSeller:any;
  surnameSeller:any;
  emailSeller:any;
  phoneSeller:any;
  idSeller:any;
  cuitSeller:any;
  photoSeller:any = '../../assets/icon/profile.jpg';
  userSeller:any;
  passwordSeller:any;
  tumama: any = "[n*~4;H,2S6-tn)6z9ps-/gh`mfQJz/5BxLzT&f6X>K2b$TNYgJ\\n$w?wUKf{(.bJB9~6G`mDMqe8c\"-kXaaWAN\".^KgD8Y5??\"/";
  c:any;
  p:any;

  title_alert:any;
  subTitle_alert:any;

  name:string;
  data1:any;
  cropperSettings1:CropperSettings;

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpProvider: HttpProvider,
              private db: AngularFireDatabase, private alertCtrl: AlertController, public loadingProvider: LoadingProvider,
              public firebaseApp: FirebaseApp, public popoverCtrl: PopoverController, private crypto: CryptoProvider) {
    if(navParams.data.sellerSelected){
      this.title = Translator.transform2('titleEdit_add_seller');

      let seller = navParams.data.sellerSelected;

      if(seller.key)      this.keySeller = seller.key;

      if(seller.code)     this.codeSeller = seller.code;
      if(seller.name)     this.nameSeller = seller.name;
      if(seller.surname)  this.surnameSeller = seller.surname;
      if(seller.phone)    this.phoneSeller = seller.phone;
      if(seller.email)    this.emailSeller = seller.email;
      if(seller.id)       this.idSeller = seller.id;
      if(seller.cuit)     this.cuitSeller = seller.cuit;
      if(seller.image)    this.photoSeller = seller.image.path;
      if(seller.user)     this.userSeller = seller.user;
      if(seller.password) this.passwordSeller = this.crypto.AES.decrypt(seller.password, this.tumama).toString(this.crypto.CryptoJS.enc.Utf8);


    } else this.title = Translator.transform2('titleAdd_add_seller');

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
    this.sellers = this.db.list('GEP/sellers');
  }

  ionViewDidLoad() {

  }

  onSubmit(f: NgForm) {
    this.loadingProvider.loadingPresent();
    setTimeout(()=>{
      this.loadingProvider.loadingDismiss();
    },7000);
    if(f.valid && !this.navParams.data.sellerSelected){
      this.c = f.value;
      this.p = this.crypto.AES.encrypt(this.c.password,this.tumama).toString();

      let user = {
        email: this.c.user,
        password: this.c.password,
        name: localStorage.getItem("name"),
        displayName: this.c.name + " " + this.c.surname,
        phone: this.c.phone || null,
      };
      this.httpProvider.generateSellerUser(user);
      this.httpProvider.sellerUser.subscribe(x=>{
        x = JSON.parse(x);
        console.log(x);
        if(x && x.s){
          this.sellers.update(x.s,{
            code: this.c.code || null,
            cuit: this.c.cuit || null,
            email: this.c.email || null,
            id: this.c.id || null,
            name: this.c.name || null,
            phone: this.c.phone || null,
            surname: this.c.surname || null,
            user: this.c.user,
            password: this.p,
          });
          this.folder = '/GEP/sellers/' + x.s;
          this.upload(x.s);
          this.sellers.update(x.s,{
            key: x.s,
          }).then(x => {
            this.loadingProvider.loadingDismiss();
            this.navCtrl.pop();
          });
        } else if(x && x.e){
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: x.e.message,
            buttons: ['OK']
          });
          alert.present();
          this.loadingProvider.loadingDismiss();
        }
      });
    } else if (f.valid && this.navParams.data.sellerSelected){
      this.c = f.value;
      this.p = this.crypto.AES.encrypt(this.c.password,this.tumama).toString();

      let user = {
        uid: this.keySeller,
        email: this.c.user,
        password: this.c.password,
        name: localStorage.getItem("name"),
        displayName: this.c.name + " " + this.c.surname,
        phone: this.c.phone || null,
      };
      this.httpProvider.editSellerUser(user);
      this.httpProvider.sellerUser.subscribe(x=>{
        x = JSON.parse(x);
        if(x && x.s){
          this.db.object('GEP/sellers/' + this.keySeller).update({
            code: this.c.code || null,
            cuit: this.c.cuit || null,
            email: this.c.email || null,
            id: this.c.id || null,
            name: this.c.name || null,
            phone: this.c.phone || null,
            surname: this.c.surname || null,
            user: this.c.user || null,
            password: this.p,
          });
          this.folder = '/GEP/sellers/'+this.keySeller;
          this.upload(this.keySeller);
          this.loadingProvider.loadingDismiss();
          this.navCtrl.pop();
        } else if(x && x.e) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: x.e.message,
            buttons: ['OK']
          });
          alert.present();
          this.loadingProvider.loadingDismiss();
        }
      });
    } else if(f.invalid) {
      let alert = this.alertCtrl.create({
        title: this.title_alert,
        subTitle: this.subTitle_alert,
        buttons: ['Ok']
      });
      alert.present();
      this.loadingProvider.loadingDismiss();
    }
  }

  openImage(){
    let photo = this.photoSeller;
    let popover = this.popoverCtrl.create(PopoverImageSellerPage, [{photo:photo}], {cssClass: 'seller-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){
        this.data1 = popoverData;
        this.photoSeller = popoverData.image;
      }
    })
  }

}
