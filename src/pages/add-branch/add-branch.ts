import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';
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
import {PopoverImageBranchPage} from "../popover-image-branch/popover-image-branch";
import {PopoverPriceListRelationsPage} from "../popover-price-list-relations/popover-price-list-relations";
import {PopoverDepositRelationsPage} from "../popover-deposit-relations/popover-deposit-relations";


/**
 * Generated class for the AddBranchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-branch',
  templateUrl: 'add-branch.html',
  providers: [ MapService ]
})
export class AddBranchPage {
  @Input() folder: string;

  title:any;

  branchs:FirebaseListObservable<any[]>;

  keyBranch:any;
  codeBranch:any;
  nameBranch:any;
  addressBranch:any;
  postalCodeBranch:any;
  emailBranch:any;
  phoneBranch:any;
  photoBranch:any = '../../assets/icon/deposit.png';

  countryBranch:any;
  provinceBranch:any;
  placeBranch:any;
  cityBranch:any;
  latLngBranch:any;


  countryName:string;
  provinceName:string;
  placeName:string;
  cityName:string;

  map:any;
  marker:any;
  el:any;

  relationPriceList:any;
  relationDeposit:any;

  title_alert:any;
  subTitle_alert:any;

  name:string;
  data1:any;
  cropperSettings1:CropperSettings;

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpProvider: HttpProvider,
              private mapService: MapService, private db: AngularFireDatabase, private alertCtrl: AlertController,
              public firebaseApp: FirebaseApp, public popoverCtrl: PopoverController, public viewCtrl: ViewController) {
    if(navParams.data.branchSelected){
      this.title = Translator.transform2('titleEdit_add_branch');

      let branch = navParams.data.branchSelected;

      if(branch.key)      this.keyBranch = branch.key;

      if(branch.code)     this.codeBranch = branch.code;
      if(branch.name)     this.nameBranch = branch.name;
      if(branch.phone)    this.phoneBranch = branch.phone;
      if(branch.email)    this.emailBranch = branch.email;
      if(branch.image)    this.photoBranch = branch.image.path;
      if(branch.priceList)this.relationPriceList = branch.priceList;
      if(branch.deposit)  this.relationDeposit = branch.deposit;

      if(branch.address["0"].address)       this.addressBranch = branch.address["0"].address;
      if(branch.address["0"].cp)            this.postalCodeBranch = branch.address["0"].cp;
      if(branch.address["0"].country){
        this.countryBranch = branch.address["0"].country.code;
        this.countryName = branch.address["0"].country.name;
      }
      if(branch.address["0"].province){
        this.provinceBranch = branch.address["0"].province.code;
        this.provinceName = branch.address["0"].province.name;
      }
      if(branch.address["0"].place){
        this.placeBranch = branch.address["0"].place.code;
        this.placeName = branch.address["0"].place.name;
      }
      if(branch.address["0"].city){
        this.cityBranch = branch.address["0"].city.code;
        this.cityName = branch.address["0"].city.name;
      }
      if(branch.address["0"].latLngBranch)  this.latLngBranch = {latitude:branch.address["0"].latLngBranch.latitude,longitude:branch.address["0"].latLngBranch.longitude};
    } else this.title = Translator.transform2('titleAdd_add_branch');

    this.title_alert = Translator.transform2('title_alert');
    this.subTitle_alert = Translator.transform2('subTitle_alert');

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
    this.branchs = this.db.list('GEP/branchs');
    // this.branchs.map(list=>list.length).subscribe(length=>this.code = length);
  }

  ionViewWillLeave(){
    this.viewCtrl.dismiss().catch(() => {});
  }

  ionViewDidLoad() {
    this.httpProvider.getCountry();

    if(this.countryBranch) {
      this.httpProvider.getProvince(this.countryBranch);
      setTimeout(x => {
        if(this.provinceBranch){
          this.getPlace(this.provinceBranch);
          setTimeout(x => {
            if(this.placeBranch){
              this.getCity(this.placeBranch);
              setTimeout(x => {
                if(this.cityBranch){
                  this.selectedCity(this.cityBranch);
                  if(this.latLngBranch){
                    this.httpProvider.longitude = this.latLngBranch.longitude;
                    this.httpProvider.latitude = this.latLngBranch.latitude;
                  }
                }
              },250)
            }
          },250);
        }
      },250);
    } else if(this.latLngBranch){
      setTimeout(x => {
        if(this.map){
          this.map.flyTo({
            center: [
              this.latLngBranch.longitude,
              this.latLngBranch.latitude
            ],
            zoom: 15
          });
        }
      },1000)
    }


    this.map = new Map({
      container: 'map',
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
      this.latLngBranch = {latitude:x.lngLat.lat,longitude:x.lngLat.lng};
    });

    if(this.latLngBranch){
      new mapboxgl.Marker(el, {offset:[-25, -25]})
        .setLngLat([this.latLngBranch.longitude,this.latLngBranch.latitude])
        .addTo(this.map);
    }

    this.mapService.map = this.map;
  }

  onSubmit(f: NgForm) {
    let addedPriceList:any={};
    if(this.relationPriceList){
      addedPriceList.name = this.relationPriceList.name;
      addedPriceList.key = this.relationPriceList.key;
    }
    let addedDeposit:any={};
    if(this.relationDeposit){
      addedDeposit.name = this.relationDeposit.name;
      addedDeposit.key = this.relationDeposit.key;
    }
    if(f.valid && !this.navParams.data.branchSelected){
      let c = f.value;
      let key = this.branchs.push({
        code: c.code || null,
        email: c.email || null,
        name: c.name || null,
        phone: c.phone || null,
        priceList: addedPriceList || null,
        deposit: addedDeposit || null,
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
            latLngBranch:{
              longitude: this.latLngBranch.longitude || null,
              latitude: this.latLngBranch.latitude || null
            }
          }
        }
      }).key;
      this.folder = '/GEP/branchs/'+key;
      this.upload(key);
      this.branchs.update(key,{
        key: key,
      }).then(x => {
        this.navCtrl.pop();
      });
    } else if (f.valid && this.navParams.data.branchSelected){
      let c = f.value;
      this.db.object('GEP/branchs/' + this.keyBranch).update({
        code: c.code || null,
        email: c.email || null,
        name: c.name || null,
        phone: c.phone || null,
        priceList: addedPriceList || null,
        deposit: addedDeposit || null,
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
            latLngBranch: {
              longitude: this.latLngBranch.longitude || null,
              latitude: this.latLngBranch.latitude || null
            }
          }
        }
      });
      this.folder = '/GEP/branchs/'+this.keyBranch;
      this.upload(this.keyBranch);
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
    let photo = this.photoBranch;
    let popover = this.popoverCtrl.create(PopoverImageBranchPage, [{photo:photo}], {cssClass: 'branch-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){
        this.data1 = popoverData;
        this.photoBranch = popoverData.image;
      }
    })
  }

  // Agregar Lista de Precios
  viewRelationsPriceList(x) {
    let popover = this.popoverCtrl.create(PopoverPriceListRelationsPage, [{brand:x}], {cssClass: 'brand-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){this.relationPriceList = popoverData}
    })
  }

  // Agregar Lista de Precios
  viewRelationsDeposit(x) {
    let popover = this.popoverCtrl.create(PopoverDepositRelationsPage, [{brand:x}], {cssClass: 'brand-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){this.relationDeposit = popoverData}
    })
  }

}
