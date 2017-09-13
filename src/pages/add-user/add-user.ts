import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';

import {HttpProvider} from "../../providers/http";

import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {PopoverImageUserPage} from "../popover-image-user/popover-image-user";
import {CryptoProvider} from "../../providers/crypto";
import {LoadingProvider} from "../../providers/loading/loading";
import {EmailValidator} from "../../validators/email";


/**
 * Generated class for the AddUserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html'
})
export class AddUserPage {
  @Input() folder: string;
  loginForm:FormGroup;

  title:any;

  users:FirebaseListObservable<any[]>;

  keyUser:any;
  codeUser:any;
  nameUser:any;
  surnameUser:any;
  emailUser:any;
  phoneUser:any;
  idUser:any;
  cuitUser:any;
  photoUser:any = '../../assets/icon/profile.jpg';
  userUser:any;
  passwordUser:any;
  tumama: any = "[n*~4;H,2S6-tn)6z9ps-/gh`mfQJz/5BxLzT&f6X>K2b$TNYgJ\\n$w?wUKf{(.bJB9~6G`mDMqe8c\"-kXaaWAN\".^KgD8Y5??\"/";
  p:any;

  title_alert:any;
  subTitle_alert:any;

  name:string;
  data1:any;
  cropperSettings1:CropperSettings;

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpProvider: HttpProvider,
              private db: AngularFireDatabase, private alertCtrl: AlertController, public loadingProvider: LoadingProvider,
              public firebaseApp: FirebaseApp, public popoverCtrl: PopoverController, private crypto: CryptoProvider,
              public formBuilder: FormBuilder) {
    // Validator Email
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required,
        EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6),
        Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      surname: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])]
    });



    if(navParams.data.userSelected){
      this.title = Translator.transform2('titleEdit_add_user');

      let user = navParams.data.userSelected;

      if(user.key)      this.keyUser = user.key;

      if(user.code)     this.codeUser = user.code;
      if(user.name)     this.nameUser = user.name;
      if(user.surname)  this.surnameUser = user.surname;
      if(user.phone)    this.phoneUser = user.phone;
      if(user.email)    this.emailUser = user.email.replace(/{punto}/g,'.');
      if(user.id)       this.idUser = user.id;
      if(user.cuit)     this.cuitUser = user.cuit;
      if(user.image)    this.photoUser = user.image.path;
      if(user.user)     this.userUser = user.user;
      if(user.password) this.passwordUser = this.crypto.AES.decrypt(user.password, this.tumama).toString(this.crypto.CryptoJS.enc.Utf8);


    } else this.title = Translator.transform2('titleAdd_add_user');

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
    this.users = this.db.list('GEP/users');
  }

  ionViewDidLoad() {

  }

  onSubmit() {
    this.loadingProvider.loadingPresent();
    setTimeout(()=>{
      this.loadingProvider.loadingDismiss();
    },7000);
    if(this.loginForm.valid && !this.navParams.data.userSelected){
      this.p = this.crypto.AES.encrypt(this.loginForm.value.password,this.tumama).toString();

      let user = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        name: localStorage.getItem("name"),
        displayName: this.loginForm.value.name + " " + this.loginForm.value.surname,
      };
      // console.log(user);
      this.httpProvider.generateUser(user);
      this.httpProvider.userUser.subscribe(x=>{
        if(x){
          x.toString();
          x = JSON.parse(x);
        }
        if(x && x.s){
          this.users.update(x.s,{
            code: this.loginForm.value.code || null,
            email: this.loginForm.value.email.replace(/\./g,'{punto}') || null,
            name: this.loginForm.value.name || null,
            surname: this.loginForm.value.surname || null,
            password: this.p,
          });
          this.folder = '/GEP/users/' + x.s;
          this.upload(x.s);
          this.users.update(x.s,{
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
    } else if (this.loginForm.valid && this.navParams.data.userSelected){
      this.p = this.crypto.AES.encrypt(this.loginForm.value.password,this.tumama).toString();
      let oldEmail = this.navParams.data.userSelected.email.replace(/{punto}/g,'.');
      let user = {
        uid: this.keyUser,
        email: this.loginForm.value.email,
        oldEmail: oldEmail || null,
        password: this.loginForm.value.password,
        name: localStorage.getItem("name"),
        displayName: this.loginForm.value.name + " " + this.loginForm.value.surname,
      };
      // console.log(user);
      this.httpProvider.editUser(user);
      this.httpProvider.userUser.subscribe(x=>{
        if(x){
          x.toString();
          x = JSON.parse(x);
        }
        if(x && x.s){
          this.db.object('GEP/users/' + this.keyUser).update({
            code: this.loginForm.value.code || null,
            email: this.loginForm.value.email.replace(/\./g,'{punto}') || null,
            name: this.loginForm.value.name || null,
            surname: this.loginForm.value.surname || null,
            password: this.p,
          });
          this.folder = '/GEP/users/'+this.keyUser;
          this.upload(this.keyUser);
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
    } else if(!this.loginForm.valid) {
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
    let photo = this.photoUser;
    let popover = this.popoverCtrl.create(PopoverImageUserPage, [{photo:photo}], {cssClass: 'user-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){
        this.data1 = popoverData;
        this.photoUser = popoverData.image;
      }
    })
  }

}
