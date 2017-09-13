import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';
import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import { NgForm } from '@angular/forms';

import { MapService } from '../../providers/map-service/map-service';
import { Map } from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js';
import * as mapboxgl from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js';

import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {PopoverImageSalesRSPage} from "../popover-image-sales-rs/popover-image-sales-rs";

import jQuery from 'jquery'
import {PopoverClientPage} from "../popover-client/popover-client";
import {AddClientPage} from "../add-client/add-client";
import {setTimeout} from "timers";


@IonicPage()
@Component({
  selector: 'page-add-sales-rs',
  templateUrl: 'add-sales-rs.html',
  providers: [ MapService ]
})
export class AddSalesRSPage {
  @Input() folder: string;

  title:any;

  salesRSs:FirebaseListObservable<any[]>;

  keySalesRS:any;
  codeSalesRS:any;
  nameSalesRS:any;
  photoSalesRS:any = '../../assets/icon/salesRS.png';
  descriptionSalesRS:any;

  title_alert:any;
  subTitle_alert:any;

  map:any;
  marker:any;
  el:any;

  name:string;
  data1:any;
  cropperSettings1:CropperSettings;

  sellers:any;
  sellerSelected:any;

  clientsArray:Array<any> = [];

  clientAdded:any = [];
  loadedClientsAdded:any = [];

  bounds:any = [];

  distance:any;
  duration:any;
  finalDuration:any;


  firstTime = true;
  firstTime2 = true;

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  Date1:any = this.updateclock();
  Date2:any = this.updateclock();
  day:any;
  days:any = [{id:0,name:Translator.transform2('sunday')},
              {id:1,name:Translator.transform2('monday')},
              {id:2,name:Translator.transform2('tuesday')},
              {id:3,name:Translator.transform2('wednesday')},
              {id:4,name:Translator.transform2('thursday')},
              {id:5,name:Translator.transform2('friday')},
              {id:6,name:Translator.transform2('saturday')}];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private db: AngularFireDatabase, private alertCtrl: AlertController,
              public firebaseApp: FirebaseApp, public popoverCtrl: PopoverController,
              public viewCtrl: ViewController, private mapService: MapService) {

    if(navParams.data.salesRSSelected){
      this.title = Translator.transform2('titleEdit_add_salesRS');

      let salesRS = navParams.data.salesRSSelected;

      if(salesRS.key)         this.keySalesRS = salesRS.key;
      if(salesRS.code)        this.codeSalesRS = salesRS.code;
      if(salesRS.name)        this.nameSalesRS = salesRS.name;
      if(salesRS.image)       this.photoSalesRS = salesRS.image.path;
      if(salesRS.description) this.descriptionSalesRS = salesRS.description;
      if(salesRS.time){
                              this.Date1 = salesRS.time.date1;
                              this.Date2 = salesRS.time.date2
      }
      if(salesRS.days)        this.day = salesRS.days;
      if(salesRS.seller){
                              this.sellerSelected = salesRS.seller;
                              setTimeout(()=>{
                                this.getSellers(this.sellerSelected)
                              },2000);
      }
      if(salesRS.distance)    this.distance = salesRS.distance;
      if(salesRS.duration)    this.finalDuration = salesRS.duration;


    } else this.title = Translator.transform2('titleAdd_add_salesRS');

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

    jQuery('body').append('<div id="popup" style="z-index: 999999;position: absolute;"></div>');
    let a = jQuery('#mapSeller');
    a.remove();
    jQuery('#createMapSeller').append('<div id="mapSeller" class="mapboxgl-map"></div>');

  }

  ionViewWillLeave(){
    this.viewCtrl.dismiss().catch(() => {});
    jQuery('#popup').remove();
  }

  updateclock() {
    function pad(n) {
      return (n < 10) ? '0' + n : n;
    }

    let time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();

    return pad(hours) + ':' + pad(minutes);
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
    this.salesRSs = this.db.list('GEP/salesRS');
    this.sellers = this.db.list('GEP/sellers');
  }

  ionViewDidLoad() {
    this.map = new Map({
      container: 'mapSeller',
      style: 'mapbox://styles/mapbox/streets-v10',
      zoom: 3,
      center: [-64, -32]
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.mapService.map = this.map;

  }

  onSubmit(f: NgForm) {
    console.log(this.loadedClientsAdded);

    if(f.valid && !this.navParams.data.salesRSSelected){
      let c = f.value;
      let key = this.salesRSs.push({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        seller: this.sellerSelected || null,
        clients: this.loadedClientsAdded || null,
        time: {
         date1: c.date1 || null,
         date2: c.date2 || null,
        },
        days: c.days || null,
        wait: c.wait || null,
        distance: this.distance || null,
        duration: this.finalDuration || null,
      }).key;
      this.folder = '/GEP/salesRS/'+key;
      this.upload(key);
      this.salesRSs.update(key,{
        key: key,
      }).then(x => {
        this.navCtrl.pop();
      });
    } else if (f.valid && this.navParams.data.salesRSSelected){
      let c = f.value;
      this.db.object('GEP/salesRS/' + this.keySalesRS).update({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        seller: this.sellerSelected || null,
        clients: this.loadedClientsAdded || null,
        time: {
          date1: c.date1 || null,
          date2: c.date2 || null,
        },
        days: c.days || null,
        wait: c.wait || null,
        distance: this.distance || null,
        duration: this.finalDuration || null,
      });
      this.folder = '/GEP/salesRS/'+this.keySalesRS;
      this.upload(this.keySalesRS);
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
    let photo = this.photoSalesRS;
    let popover = this.popoverCtrl.create(PopoverImageSalesRSPage, [{photo:photo}], {cssClass: 'salesRS-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData){
        this.data1 = popoverData;
        this.photoSalesRS = popoverData.image;
      }
    })
  }

  getSellers(x){
    if(!this.firstTime && this.map.getLayer("route")) {
      this.map.removeLayer("route");
      this.map.removeSource("route");
    }
    this.distance = '0m';
    this.duration = '00:00:00';
    this.finalDuration = '00:00:00';

    this.db.app.database().ref('GEP/clients').orderByChild("seller").equalTo(x).once('value', y => {
      let clients = y.val();
      this.clientsArray = [];
      this.clientAdded = [];
      this.loadedClientsAdded = [];
      this.bounds = [];
      let bounds = new mapboxgl.LngLatBounds();
      jQuery('.marker').remove();
      jQuery('#popup1').remove();
      if(clients){
        for(let i in clients){
          this.clientsArray.push(clients[i]);

          let el = document.createElement('div');
          el.className = 'marker ' + clients[i].key;
          if(clients[i].image) el.style.backgroundImage = "url(" + clients[i].image.path + ")";
          else el.style.backgroundImage = 'url(../../assets/icon/profile.jpg)';
          el.style.width = '50px';
          el.style.height = '50px';
          el.style.opacity = '0.5';
          el.style.border = '2px solid';

          el.addEventListener('click', () => {
            this.addClient(clients[i], false);
          });

          el.addEventListener('mouseover', event => {
            jQuery('#popup').append('<div id="popup1"><div id="popup-tittle">' + clients[i].name +' '+ clients[i].surname + '</div><div id="popup-content1">' + clients[i].address[0].address + '</div><div id="popup-content2">' + clients[i].address[0].city.name + ', ' + clients[i].address[0].province.name + '</div></div>');
            jQuery('#popup').css({
              'left': event.clientX,
              'top': event.clientY,
              'display': 'inline',
              'position': 'absolute',
              'background-color': 'white',
              'box-shadow': '0 2px 2px rgba(0,0,0,0.2)',
              'overflow': 'hidden',
              'border-radius': '1px',
              'font-family': 'Roboto, Arial, sans-serif',
              'padding': '4px 14px 5px'
            });
            jQuery('#popup-tittle').css({
              'font-size': '15px',
              'line-height': '16px',
              'padding-bottom': '2px',
              'overflow': 'hidden',
              'text-overflow': 'ellipsis',
              'white-space': 'nowrap',
            });
            jQuery('#popup-content1').css({
              'color': '#616161',
              'font-size': '12px',
              'font-weight': '400',
              'overflow': 'hidden',
              'text-overflow': 'ellipsis',
            });
            jQuery('#popup-content2').css({
              'color': '#616161',
              'font-size': '12px',
              'font-weight': '400',
              'overflow': 'hidden',
              'text-overflow': 'ellipsis',
            });

            console.log(clients[i].name)
          });
          el.addEventListener('mouseout', event => {
            jQuery('#popup1').remove();
            jQuery('#popup').css('display', 'none');
          });

          // add marker to map
          new mapboxgl.Marker(el)
            .setLngLat([clients[i].address[0].latLngClient.longitude,clients[i].address[0].latLngClient.latitude])
            // .setPopup(popup)
            .addTo(this.map);

          this.bounds.push([clients[i].address[0].latLngClient.longitude,clients[i].address[0].latLngClient.latitude]);
          bounds.extend([clients[i].address[0].latLngClient.longitude,clients[i].address[0].latLngClient.latitude]);
        }

        this.map.fitBounds(bounds, {
          padding: 50
        });


        if(this.firstTime && this.navParams.data.salesRSSelected.clients){
          this.firstTime = false;
          for(let j in this.navParams.data.salesRSSelected.clients){
            for(let i in clients){
              if(clients[i].key == this.navParams.data.salesRSSelected.clients[j].key){
                this.addClient(this.navParams.data.salesRSSelected.clients[j],true);
                break
              }
            }
          }
          this.setRoute();
        }
      }
    })
  }

  addClient(x,y){
    let flag = true;
    for(let i in this.clientAdded){
      if(this.clientAdded[i].key == x.key){
        flag = false;
        this.clientAdded.splice(i,1);
        jQuery('.' + x.key).css( "border", "2px solid" ).css("opacity", "0.5").css("width","50px!important").css("height", "50px!important");
        break
      }
    }
    if(flag){
      this.clientAdded.push(x);
      jQuery('.' + x.key).css( "border", "2px solid rgb(92, 184, 92)" ).css("opacity", "1").css("width","53px!important").css("height", "53px!important");
    }
    this.loadedClientsAdded = this.clientAdded;
    if(!this.firstTime2 || !y){
      this.setRoute();
    }
  }

  getItems(searchBar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    let q = searchBar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.clientAdded = this.clientAdded.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1 || (v.surname && v.surname.toLowerCase().indexOf(q.toLowerCase()) > -1)
          || (v.phone && v.phone.toLowerCase().indexOf(q.toLowerCase()) > -1) || (v.code && v.code.toLowerCase().indexOf(q.toLowerCase()) > -1)
          || (v.address[0].address && v.address[0].address.toLowerCase().indexOf(q.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
    });
  }

  initializeItems(): void {
    this.clientAdded = this.loadedClientsAdded;
  }

  viewClient(event, x:any) {
    x.dontDelete = true;
    let popover = this.popoverCtrl.create(PopoverClientPage,x, {cssClass: 'client-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editClient(popoverData);
    })
  }

  editClient(x){
    this.navCtrl.push(AddClientPage,{
      clientSelected: x
    });
  }

  loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          if (success)
            success(JSON.parse(xhr.responseText));
        } else {
          if (error)
            error(xhr);
        }
      }
    };
    xhr.open("GET", path, true);
    xhr.send();
  }

  setRoute(){
    if(this.loadedClientsAdded.length > 1){
      let coord = '';
      for(let i in this.loadedClientsAdded){
        coord += this.loadedClientsAdded[i].address[0].latLngClient.longitude + ',' + this.loadedClientsAdded[i].address[0].latLngClient.latitude + ';';
      }
      coord = coord.slice(0,-1);

      let URL = 'https://api.mapbox.com/directions/v5/mapbox/driving/'+ coord +'.json?access_token=pk.eyJ1IjoiY29ucXVlciIsImEiOiJjajN3eWd3ZGswMDhlMnFyeWplMDVpdjNxIn0.Jj7LeikoSKgUiqar41JFpw&steps=true&overview=simplified&geometries=geojson';
      try{
        this.loadJSON(URL,
          jsonobject => {
            console.log(jsonobject);

            if(this.map.getLayer("route")) {
              this.map.removeLayer("route");
              this.map.removeSource("route");
            }

            this.map.addLayer({
              "id": "route",
              "type": "line",
              "source": {
                "type": "geojson",
                "data": {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                    "type": "LineString",
                    "coordinates": jsonobject.routes["0"].geometry.coordinates,
                  }
                }
              },
              "layout": {
                "line-join": "round",
                "line-cap": "round"
              },
              "paint": {
                "line-color": "#488aff",
                "line-width": 4
              }
            });

            this.duration = this.durationFn(jsonobject.routes["0"].duration);
            this.distance = this.distanceFn(jsonobject.routes["0"].distance);
            this.calTime();

            for(let i = 0; i < this.clientAdded.length; i++){
              this.clientAdded[i].distance = null;
              this.clientAdded[i].duration = null;
              if(i > 0){
                this.clientAdded[i].distance = this.distanceFn(jsonobject.routes["0"].legs[i-1].distance);
                this.clientAdded[i].duration = this.durationFn(jsonobject.routes["0"].legs[i-1].duration);
              }
            }

          },
          error => {
            console.log(error);
          });
      }
      catch(err){
        console.log(err);
      }
    } else{
      this.distance = '0m';
      this.duration = '00:00:00';
      this.finalDuration = '00:00:00';
      for(let i = 0; i < this.clientAdded.length; i++) {
        this.clientAdded[i].distance = null;
        this.clientAdded[i].duration = null;
      }
      if(this.map.getLayer("route")) {
        this.map.removeLayer("route");
        this.map.removeSource("route");
      }
    }
    this.firstTime2 = false;
  }

  durationFn(x){
    let duration = new Date(null);
    duration.setSeconds(x); // specify value for SECONDS here
    return duration.toISOString().substr(11, 8);
  }

  distanceFn(x){
    let distance = x;
    if (distance >= 1000) {
      return (distance/1000).toFixed(2) + 'km';
    } else {
      return distance.toFixed(2) + 'm';
    }
  }

  calTime(){
    let timeArray = [];
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    for(let i = 0; i < this.clientAdded.length; i++) {
      timeArray.push((this.clientAdded[i].wait || "00:00") + ":00");
    }
    timeArray.push(this.duration);
    console.log(timeArray);
    for(let i in timeArray){
      let k = timeArray[i].split(":");
      seconds += (+k[2]);
      minutes += (+k[1]);
      hours += (+k[0]);
      if(seconds >= 60){
        seconds -= 60;
        minutes += 1;
      }
      if(minutes >= 60){
        minutes -= 60;
        hours += 1 ;
      }
    }
    let secondsF; let minutesF; let hoursF;
    if(seconds < 10) secondsF = "0" + seconds;
    if(minutes < 10) minutesF = "0" + minutes;
    if(hours < 10) hoursF = "0" + hours;
    this.finalDuration = (hoursF || hours) + ":" + (minutesF || minutes) + ":" + (secondsF || seconds);
  }

}
