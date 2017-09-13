import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, Platform, ToastController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth";
import {AngularFireAuth} from "angularfire2/auth";
import {MyApp} from "../../app/app.component";
import {Deploy} from "@ionic/cloud-angular";
import {LangBundle} from "../../language/langBundle";
import {Translator} from "../../pipes/eigonic-translator/eigonic-translator";
import {CryptoProvider} from "../../providers/crypto";
import {ThemeProvider} from "../../providers/theme/theme";
import {AngularFireDatabase} from "angularfire2/database";

import { StatusBar } from '@ionic-native/status-bar';



/**
 * Generated class for the Home page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class Home {
  loadProgress:any = 0;

  rootPage:any;
  language:any;
  selectedTheme: String;
  timeOut:any;

  constructor(platform: Platform, private afAuth: AngularFireAuth, private authProvider: AuthProvider, private deploy: Deploy, private loadingCtrl: LoadingController,
              private toastCtrl: ToastController, private alertCtrl: AlertController, private crypto: CryptoProvider, private settings: ThemeProvider,
              private db: AngularFireDatabase, private statusBar: StatusBar) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    if(localStorage.getItem('theme'))this.settings.setActiveTheme(localStorage.getItem('theme'));

    this.language = localStorage.getItem('language');
    if(this.language){
      Translator.init(LangBundle.MSG, this.language)
    } else Translator.init(LangBundle.MSG, navigator.language.split('-')[0]);





    platform.ready().then(() => {

      if (platform.is('cordova')) {




        this.statusBar.overlaysWebView(true);
        this.statusBar.backgroundColorByHexString(this.color());

        // const checking = this.loadingCtrl.create({
        //   content: 'Checking for update...'
        // });
        // checking.present();
        //
        // this.timeOut = setTimeout(()=>{
        //   const toast = this.toastCtrl.create({
        //     message: 'No update available',
        //     duration: 3000
        //   });
        //   checking.dismiss();
        //   toast.present();
        //   this.goRoot();
        // },90000);
        // this.deploy.check().then((snapshotAvailable: boolean) => {
        //   clearTimeout(this.timeOut);
        //   checking.dismiss();
        //   if (snapshotAvailable) {
        //
        //   this.alert();
        //
        //   } else {
        //     const toast = this.toastCtrl.create({
        //       message: 'No update available',
        //       duration: 3000
        //     });
        //     toast.present();
        //     this.goRoot();
        //   }
        // });
        this.goRoot(); // Quitar
      } else{
        this.goRoot();
      }
    });


  }

  private goRoot(){
    const authObserver = this.afAuth.authState.subscribe( user => {
      if (user) {
        this.authProvider.loginSucess();
        this.db.app.database().ref('theme').on('value', x =>{
          if(x.val()){
            let theme = x.val().toString();
            this.settings.setActiveTheme(theme);
            localStorage.setItem('theme',theme);
            this.statusBar.backgroundColorByHexString(this.color());
          }
        });
        this.rootPage = MyApp;
        authObserver.unsubscribe();
      } else {

        if(localStorage.getItem('color') && localStorage.getItem('width')) {
          let bridge2 = "W'XykEGe'7yqxd8;Zh5F{QDy:NUMUc&RcavKSKX(T.;(+Rb76ENy_RXLwfK[yVa8mpBt,chZmSu,*gu_K[_K22_vfA:Y<'c.b[:pMss=:v;Eb";
          const color = this.crypto.AES.decrypt(localStorage.getItem('color'),bridge2).toString(this.crypto.CryptoJS.enc.Utf8);
          const width = this.crypto.AES.decrypt(localStorage.getItem('width'),bridge2).toString(this.crypto.CryptoJS.enc.Utf8);
          this.authProvider.loginUser(color, width).then( authData => {
            this.db.app.database().ref('theme').on('value', x =>{
              if(x.val()){
                let theme = x.val().toString();
                this.settings.setActiveTheme(theme);
                localStorage.setItem('theme',theme);
                this.statusBar.backgroundColorByHexString(this.color());
              }
            });
            localStorage.removeItem('color');
            localStorage.removeItem('width');
            this.rootPage = MyApp;
          }, error => {
            console.log(error);
            this.rootPage = 'LoginPage';
          });

        } else {
          this.rootPage = 'LoginPage';
        }
        authObserver.unsubscribe();
      }
    });
  }

  private alert() {
    let prompt = this.alertCtrl.create({
      title: 'Upload',
      message: "You want to upgrade to the latest version",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            this.goRoot();
          }
        },
        {
          text: 'Ok',
          handler: data => {
            const updating = this.loadingCtrl.create({
              content: 'Updating application...'
            });
            updating.present();
            let interval = setInterval(()=>{
              this.loadProgress++;
              if(this.loadProgress >= 100){
                this.loadProgress = 0;
                clearInterval(interval);
              }
            },100);
            this.deploy.download().then(() => this.deploy.extract()).then(() => this.deploy.load());
          }
        }
      ]
    });
    prompt.present();
  }

  private color(){
    let color:string = '#488aff';
    switch (localStorage.getItem('theme')){
      case 'blue-theme': {
        color = '#4a8bfc';
        break;
      }
      case 'dark-theme': {
        color = '#222';
        break;
      }
      case 'glups-theme': {
        color = '#ec008c';
        break;
      }
      case 'green-theme': {
        color = '#70a83b';
        break;
      }
      case 'grido-theme': {
        color = '#134390';
        break;
      }
      case 'light-theme': {
        color = '#4a8bfc';
        break;
      }
      case 'orange-theme': {
        color = '#ff6600';
        break;
      }
      case 'white-theme': {
        color = '#fdfefe';
        break;
      }
    }
    return color
  }

}
