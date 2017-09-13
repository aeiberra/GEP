import { Injectable } from '@angular/core';
import {Http, RequestOptions, BaseRequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {CryptoProvider} from "./crypto";

import {MyApp} from "../app/app.component";
import {AlertController, App, Loading, LoadingController} from "ionic-angular";
import {AuthProvider} from "./auth";
import { Observable } from "rxjs/Observable";


@Injectable()
export class HttpProvider extends BaseRequestOptions{
  private setCookies: any;
  private cookies: any;
  private options: any;
  private bridge = "L]bTwXf.1R[<GX^oz7q}x4=Rt9JK`nqll8FtGPoUbunC9S<!?CB1_:6'NY1sSA<6rll1lvn2qm]/eR4u7'n&8p1I06iK*1,c1,9$=J!NYG,Gz";
  private bridge2 = "W'XykEGe'7yqxd8;Zh5F{QDy:NUMUc&RcavKSKX(T.;(+Rb76ENy_RXLwfK[yVa8mpBt,chZmSu,*gu_K[_K22_vfA:Y<'c.b[:pMss=:v;Eb";
  public countries: any;
  public provinces: any;
  public provincesActive: boolean = false;
  public places: any;
  public placesActive: boolean = false;
  public city: any;
  public cityActive: boolean = false;
  public latitude = -32;
  public longitude = -64;
  public branch: any;
  public branchToken: any;
  public sellerUser: any;
  public userUser: any;

  loading:Loading;

  constructor(public http: Http, private crypto: CryptoProvider, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController, public authData: AuthProvider, private app: App) {
    super();
    this.getCountry();
  }

  randomString(length, chars) {
    let mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    let result = '';
    for (let i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
  }

  doing () {
    let char = new Date().getTime().toString().split('');
    this.cookies = this.randomString(8, '#aA!')+char[0]+this.randomString(12, '#aA!')+char[1]+this.randomString(11, '#aA!')+char[2]+this.randomString(10, '#aA!')+char[3]+this.randomString(9, '#aA!')+char[4]+this.randomString(8, '#aA!')+char[5]+this.randomString(7, '#aA!')+char[6]+this.randomString(6, '#aA!')+char[7]+this.randomString(5, '#aA!')+char[8]+this.randomString(4, '#aA!')+char[9]+this.randomString(3, '#aA!')+char[10]+this.randomString(2, '#aA!')+char[11]+this.randomString(1, '#aA!')+char[12]+this.randomString(10, '#aA!');
    return this.crypto.CryptoJS.AES.encrypt(this.cookies.toString(),this.setCookies.toString());
  };

  doCookies () {
    let key = (this.randomString(7, '#aA!')).toString()+(new Date().getMinutes()*(60*new Date().getMinutes())*1000)+(this.randomString(7, '#aA!')).toString();
    this.setCookies = this.crypto.CryptoJS.Rabbit.encrypt(key,this.bridge);
  };

  onSubmit() {
    let body = this.createCall({test:'test'});
    this.http.post('http://174.138.41.153:3343/firebase/post/test', {body: body.toString()}, this.options)
      .subscribe(
        (x:any) => {
          alert("Success");
          console.log(x._body);
        }, //For Success Response
        err => {
          console.error(err);
        } //For Error Response
      );
  }

  createCall(value) {
    this.doCookies();
    this.headers.set("Accept-Cookie", this.doing());
    this.headers.set("Set-Cookie", this.setCookies);
    this.options = new RequestOptions({ headers: this.headers });
    return this.crypto.AES.encrypt(JSON.stringify(value), this.setCookies.toString());
  }

  obtainFirebase(email) {
    let body = this.createCall(email);
    this.http.post('http://174.138.41.153:3343/firebase/post/obtain', {body: body.toString()}, this.options)
      .subscribe(
        (x:any) => {
          alert("Success");
          console.log(x._body);
        }, //For Success Response
        err => {
          console.error(err);
        } //For Error Response
      );
  }

  getCountry() {
    this.createCall('');
    this.http.get('http://174.138.41.153:3343/geoName/get/country', this.options)
      .subscribe(
        (x:any) => {
          if(x._body && JSON.parse(x._body || 'null')) this.countries = JSON.parse(x._body).country;
        }, //For Success Response
        err => {
          console.error(err);
        } //For Error Response
      );
  }

  getProvince (id) {
    this.provincesActive = false;
    this.placesActive = false;
    this.places = null;
    this.cityActive = false;
    this.city = null;
    this.doCookies();
    this.headers.set("Accept-Cookie", this.doing());
    this.headers.set("Set-Cookie", this.setCookies);
    this.headers.set("id",id);
    this.options = new RequestOptions({ headers: this.headers });
    this.http.get('http://174.138.41.153:3343/geoName/get/province', this.options)
      .subscribe(
        (x:any) => {
          if(x._body && JSON.parse(x._body || 'null')){
            this.provinces = JSON.parse(x._body).province;
            this.provincesActive = true;
          }
        }, //For Success Response
        err => {
          console.error(err);
        } //For Error Response
      );
  }

  getPlace (id) {
    for(let i in this.provinces){
      if(this.provinces[i].id == id){
        this.latitude = this.provinces[i].lat;
        this.longitude = this.provinces[i].lng;
        break
      }
    }
    console.log(this.latitude,this.longitude);
    this.placesActive = false;
    this.cityActive = false;
    this.city = null;
    this.doCookies();
    this.headers.set("Accept-Cookie", this.doing());
    this.headers.set("Set-Cookie", this.setCookies);
    this.headers.set("id",id);
    this.options = new RequestOptions({ headers: this.headers });
    this.http.get('http://174.138.41.153:3343/geoName/get/place', this.options)
      .subscribe(
        (x:any) => {
          if(x._body && JSON.parse(x._body || 'null')){
            this.places = JSON.parse(x._body).place;
            this.placesActive = true;
          }
        }, //For Success Response
        err => {
          console.error(err);
        } //For Error Response
      );
  }

  getCity (id) {
    for(let i in this.places){
      if(this.places[i].id == id){
        this.latitude = this.places[i].lat;
        this.longitude = this.places[i].lng;
        break
      }
    }
    console.log(this.latitude,this.longitude);
    this.cityActive = false;
    this.doCookies();
    this.headers.set("Accept-Cookie", this.doing());
    this.headers.set("Set-Cookie", this.setCookies);
    this.headers.set("id",id);
    this.options = new RequestOptions({ headers: this.headers });
    this.http.get('http://174.138.41.153:3343/geoName/get/city', this.options)
      .subscribe(
        (x:any) => {
          if(x._body && JSON.parse(x._body || 'null')){
            this.city = JSON.parse(x._body).city;
            this.cityActive = true;
          }
        }, //For Success Response
        err => {
          console.error(err);
        } //For Error Response
      );
  }

  selectedCity(id) {
    for(let i in this.city){
      if(this.city[i].id == id){
        this.latitude = this.city[i].lat;
        this.longitude = this.city[i].lng;
        break
      }
    }
    console.log(this.latitude,this.longitude);
  }

  searchUser(email, password){
    let emailNew = email;
    let passwordNew = password;

    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();

    let body = this.createCall(email);
    this.http.post('http://174.138.41.153:3343/firebase/post/FirebaseUser', {body: body.toString()}, this.options)
      .subscribe(
        (x:any) => {
          let y = JSON.parse(x._body);
          if(y && y.Data){
            if(y.Data.name == localStorage.getItem('name')){

              this.authData.loginUser(email, password)
                .then( authData => {
                  this.app.getActiveNav().setRoot(MyApp);
                  localStorage.removeItem('color');
                  localStorage.removeItem('width');
                }, error => {
                  this.loading.dismiss().then( () => {
                    let alert = this.alertCtrl.create({
                      message: error.message,
                      buttons: [
                        {
                          text: "Ok",
                          role: 'cancel'
                        }
                      ]
                    });
                    alert.present();
                  });
                });

            } else {
              let name = y.Data.name;
              let apiKey = this.crypto.AES.decrypt(y.Data.apiKey,this.bridge2).toString(this.crypto.CryptoJS.enc.Utf8);
              let authDomain = this.crypto.AES.decrypt(y.Data.authDomain,this.bridge2).toString(this.crypto.CryptoJS.enc.Utf8);
              let databaseURL = this.crypto.AES.decrypt(y.Data.databaseURL,this.bridge2).toString(this.crypto.CryptoJS.enc.Utf8);
              let project_id = this.crypto.AES.decrypt(y.Data.project_id,this.bridge2).toString(this.crypto.CryptoJS.enc.Utf8);
              let storageBucket = this.crypto.AES.decrypt(y.Data.storageBucket,this.bridge2).toString(this.crypto.CryptoJS.enc.Utf8);
              let messagingSenderId = this.crypto.AES.decrypt(y.Data.messagingSenderId,this.bridge2).toString(this.crypto.CryptoJS.enc.Utf8);
              emailNew = this.crypto.AES.encrypt(emailNew,this.bridge2).toString();
              passwordNew = this.crypto.AES.encrypt(passwordNew,this.bridge2).toString();

              localStorage.setItem('name',              name);
              localStorage.setItem('apiKey',            apiKey);
              localStorage.setItem('authDomain',        authDomain);
              localStorage.setItem('databaseURL',       databaseURL);
              localStorage.setItem('projectId',         project_id);
              localStorage.setItem('storageBucket',     storageBucket);
              localStorage.setItem('messagingSenderId', messagingSenderId);

              localStorage.setItem('color', emailNew);
              localStorage.setItem('width', passwordNew);

              window.location.reload();
            }
          } else{
            this.loading.dismiss().then( () => {
              let alert = this.alertCtrl.create({
                message: "The password is invalid or the user does not have a password.",
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
              alert.present();
            });
          }
        }, //For Success Response
        err => {
          console.error(err);
        } //For Error Response
      );
  }

  generateBranchToken(y){
    this.branchToken = Observable.create(observer => {
      observer.next('null');
      let body = this.createCall(y);
      this.http.post('http://174.138.41.153:3343/firebase/post/GenerateToken', {body: body.toString()}, this.options)
        .subscribe(
          (x:any) => {
            observer.next(x._body);
          }, //For Success Response
          err => {
            console.error(err);
          } //For Error Response
        );
    });
  }

  generateSellerUser(y){
    this.sellerUser = Observable.create(observer => {
      observer.next('null');
      let body = this.createCall(y);
      this.http.post('http://174.138.41.153:3343/firebase/post/GenerateSellerUser', {body: body.toString()}, this.options)
        .subscribe(
          (x:any) => {
            observer.next(x._body);
          }, //For Success Response
          err => {
            console.error(err);
          } //For Error Response
        );
    });
  }

  editSellerUser(y){
    this.sellerUser = Observable.create(observer => {
      observer.next('null');
      let body = this.createCall(y);
      this.http.post('http://174.138.41.153:3343/firebase/post/EditSellerUser', {body: body.toString()}, this.options)
        .subscribe(
          (x:any) => {
            observer.next(x._body);
          }, //For Success Response
          err => {
            console.error(err);
          } //For Error Response
        );
    });
  }

  deleteSellerUser(y){
    this.sellerUser = Observable.create(observer => {
      observer.next('null');
      let body = this.createCall(y);
      this.http.post('http://174.138.41.153:3343/firebase/post/DeleteSellerUser', {body: body.toString()}, this.options)
        .subscribe(
          (x:any) => {
            observer.next(x._body);
          }, //For Success Response
          err => {
            console.error(err);
          } //For Error Response
        );
    });
  }

  generateUser(y){
    this.userUser = Observable.create(observer => {
      observer.next('null');
      let body = this.createCall(y);
      this.http.post('http://174.138.41.153:3343/firebase/post/GenerateAdminUser', {body: body.toString()}, this.options)
        .subscribe(
          (x:any) => {
            observer.next(x._body);
          }, //For Success Response
          err => {
            console.error(err);
          } //For Error Response
        );
    });
  }

  editUser(y){
    this.userUser = Observable.create(observer => {
      observer.next('null');
      let body = this.createCall(y);
      this.http.post('http://174.138.41.153:3343/firebase/post/EditAdminUser', {body: body.toString()}, this.options)
        .subscribe(
          (x:any) => {
            observer.next(x._body);
          }, //For Success Response
          err => {
            console.error(err);
          } //For Error Response
        );
    });
  }

  deleteUser(y){
    this.userUser = Observable.create(observer => {
      observer.next('null');
      let body = this.createCall(y);
      this.http.post('http://174.138.41.153:3343/firebase/post/DeleteAdminUser', {body: body.toString()}, this.options)
        .subscribe(
          (x:any) => {
            observer.next(x._body);
          }, //For Success Response
          err => {
            console.error(err);
          } //For Error Response
        );
    });
  }

  branchObtain(y){
    this.branch = Observable.create(observer => {
      observer.next('null');
      let body = this.createCall(y);
      this.http.post('http://174.138.41.153:3343/apiRest/post/BranchObtain', {body: body.toString()}, this.options)
        .subscribe(
          (x:any) => {
            observer.next(x._body);
          }, //For Success Response
          err => {
            console.error(err);
          } //For Error Response
        );
    });
  }

}
