import {Component, Input, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, NavController, NavParams, PopoverController,
  ViewController
} from 'ionic-angular';
import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import { NgForm } from '@angular/forms';

import {HttpProvider} from "../../providers/http";

import { MapService } from '../../providers/map-service/map-service';
import { Map } from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js';
import * as mapboxgl from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js';

import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {PopoverImageClientPage} from "../popover-image-client/popover-image-client";

import jQuery from 'jquery'


/**
 * Generated class for the AddClientPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-client',
  templateUrl: 'add-client.html',
  providers: [ MapService ]
})
export class AddClientPage {
  @Input() folder: string;

  title:any;

  clients:FirebaseListObservable<any[]>;

  keyClient:any;
  codeClient:any;
  nameClient:any;
  surnameClient:any;
  addressClient:any;
  postalCodeClient:any;
  emailClient:any;
  phoneClient:any;
  idClient:any;
  cuitClient:any;
  photoClient:any = '../../assets/icon/profile.jpg';

  countryClient:any;
  provinceClient:any;
  placeClient:any;
  cityClient:any;
  latLngClient:any;


  countryName:string;
  provinceName:string;
  placeName:string;
  cityName:string;

  map:any;
  marker:any;
  el:any;

  title_alert:any;
  subTitle_alert:any;

  name:string;
  data1:any;
  cropperSettings1:CropperSettings;

  sellers:any;
  sellersClient:any;

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpProvider: HttpProvider,
              private mapService: MapService, private db: AngularFireDatabase, private alertCtrl: AlertController,
              public firebaseApp: FirebaseApp, public popoverCtrl: PopoverController, public viewCtrl: ViewController) {
    if(navParams.data.clientSelected){
      this.title = Translator.transform2('titleEdit_add_client');

      let client = navParams.data.clientSelected;

      if(client.key)      this.keyClient = client.key;

      if(client.code)     this.codeClient = client.code;
      if(client.name)     this.nameClient = client.name;
      if(client.surname)  this.surnameClient = client.surname;
      if(client.phone)    this.phoneClient = client.phone;
      if(client.email)    this.emailClient = client.email;
      if(client.id)       this.idClient = client.id;
      if(client.cuit)     this.cuitClient = client.cuit;
      if(client.image)    this.photoClient = client.image.path;
      if(client.seller)   this.sellersClient = client.seller;


      if(client.address["0"].address)       this.addressClient = client.address["0"].address;
      if(client.address["0"].cp)            this.postalCodeClient = client.address["0"].cp;
      if(client.address["0"].country){
                                            this.countryClient = client.address["0"].country.code;
                                            this.countryName = client.address["0"].country.name;
      }
      if(client.address["0"].province){
                                            this.provinceClient = client.address["0"].province.code;
                                            this.provinceName = client.address["0"].province.name;
      }
      if(client.address["0"].place){
                                            this.placeClient = client.address["0"].place.code;
                                            this.placeName = client.address["0"].place.name;
      }
      if(client.address["0"].city){
                                            this.cityClient = client.address["0"].city.code;
                                            this.cityName = client.address["0"].city.name;
      }
      if(client.address["0"].latLngClient)  this.latLngClient = {latitude:client.address["0"].latLngClient.latitude,longitude:client.address["0"].latLngClient.longitude};
    } else this.title = Translator.transform2('titleAdd_add_client');

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
    this.clients = this.db.list('GEP/clients');
    this.sellers = this.db.list('GEP/sellers');
  }

  ionViewWillLeave(){
    this.viewCtrl.dismiss().catch(() => {});
  }

  ionViewDidLoad() {
    let a = jQuery('#mapClient');
    a.remove();
    jQuery('#createMap').append('<div id="mapClient" class="mapboxgl-map"></div>');

    this.httpProvider.getCountry();

    if(this.countryClient) {
      this.httpProvider.getProvince(this.countryClient);
      setTimeout(x => {
        if(this.provinceClient){
          this.getPlace(this.provinceClient);
          setTimeout(x => {
            if(this.placeClient){
              this.getCity(this.placeClient);
              setTimeout(x => {
                if(this.cityClient){
                  this.selectedCity(this.cityClient);
                  if(this.latLngClient){
                    this.httpProvider.longitude = this.latLngClient.longitude;
                    this.httpProvider.latitude = this.latLngClient.latitude;
                  }
                }
              },250)
            }
          },250);
        }
      },250);
    }

    this.map = new Map({
      container: 'mapClient',
      style: 'mapbox://styles/mapbox/streets-v10',
      zoom: 3,
      center: [-64, -32]
    });
    this.map.addControl(new mapboxgl.NavigationControl());

    // create DOM element for the marker
    let el = document.createElement('div');
    el.id = 'marker';

    this.map.on('click', x=>{
      new mapboxgl.Marker(el, {offset:[-25, -25]})
        .setLngLat([x.lngLat.lng,x.lngLat.lat])
        .addTo(this.map);
      this.latLngClient = {latitude:x.lngLat.lat,longitude:x.lngLat.lng};
    });

    if(this.latLngClient){
      new mapboxgl.Marker(el, {offset:[-25, -25]})
        .setLngLat([this.latLngClient.longitude,this.latLngClient.latitude])
        .addTo(this.map);
    }

    this.mapService.map = this.map;
  }

  onSubmit(f: NgForm) {
    if(f.valid && !this.navParams.data.clientSelected && this.latLngClient){
      let c = f.value;
      let key = this.clients.push({
        code: c.code || null,
        cuit: c.cuit || null,
        email: c.email || null,
        id: c.id || null,
        name: c.name || null,
        phone: c.phone || null,
        surname: c.surname || null,
        seller: this.sellersClient || null,
        address: {
          0: {
            city:{
              code:c.city || null,
              name:this.cityName || null
            },
            country:{
              code: c.country || null,
              name: this.countryName || null
            },
            place:{
              code: c.place || null,
              name: this.placeName || null
            },
            province:{
              code: c.province || null,
              name: this.provinceName || null
            },
            address: c.address || null,
            cp: c.postalCode || null,
            code: 0,
            latLngClient:{
              longitude: this.latLngClient.longitude || null,
              latitude: this.latLngClient.latitude || null
            }
          }
        }
      }).key;
      this.folder = '/GEP/clients/'+key;
      this.upload(key);
      this.clients.update(key,{
        key: key,
      }).then(x => {
        this.navCtrl.pop();
      });
    } else if (f.valid && this.navParams.data.clientSelected && this.latLngClient){
      let c = f.value;
      this.db.object('GEP/clients/' + this.keyClient).update({
        code: c.code || null,
        cuit: c.cuit || null,
        email: c.email || null,
        id: c.id || null,
        name: c.name || null,
        phone: c.phone || null,
        surname: c.surname || null,
        seller: this.sellersClient || null,
        address: {
          0: {
            city: {
              code: c.city || null,
              name: this.cityName || null
            },
            country: {
              code: c.country || null,
              name: this.countryName || null
            },
            place: {
              code: c.place || null,
              name: this.placeName || null
            },
            province: {
              code: c.province || null,
              name: this.provinceName || null
            },
            address: c.address || null,
            cp: c.postalCode || null,
            code: 0,
            latLngClient: {
              longitude: this.latLngClient.longitude || null,
              latitude: this.latLngClient.latitude || null
            }
          }
        }
      });
      this.folder = '/GEP/clients/'+this.keyClient;
      this.upload(this.keyClient);
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

   getName(x,y) {
     switch (x) {
       case 'country': {
         this.countryName = y;
         break;
       }
       case 'province': {
         this.provinceName = y;
         break;
       }
       case 'place': {
         this.placeName = y;
         break;
       }
       case 'city': {
         this.cityName = y;
         break;
       }
     }
   }

   flyMap(z) {
     setTimeout(x => {
       this.map.flyTo({
         center: [
           this.httpProvider.longitude,
           this.httpProvider.latitude
         ],
         zoom: z
       });
     },500)
   }

   getPlace(id) {
    this.httpProvider.getPlace(id);
    this.flyMap(6);
   }

  getCity(id) {
    this.httpProvider.getCity(id);
    this.flyMap(9);
  }

  selectedCity(id) {
    this.httpProvider.selectedCity(id);
    this.flyMap(12);
  }

  openImage(){
    let photo = this.photoClient;
    let popover = this.popoverCtrl.create(PopoverImageClientPage, [{photo:photo}], {cssClass: 'client-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){
        this.data1 = popoverData;
        this.photoClient = popoverData.image;
      }
    })
  }

}
