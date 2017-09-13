import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import { NgForm } from '@angular/forms';

import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import {LoadingProvider} from "../../providers/loading/loading";


@IonicPage()
@Component({
  selector: 'page-add-billing',
  templateUrl: 'add-billing.html',
})
export class AddBillingPage {
  @Input() folder: string;

  title:any;

  billings:FirebaseListObservable<any[]>;

  keyBilling:any;
  codeBilling:any;
  nameBilling:any;
  descriptionBilling:any;

  title_alert:any;
  subTitle_alert:any;

  searchQuery: string = '';
  clients:FirebaseListObservable<any[]>;
  client;
  public clientsList:Array<any>;
  public loadedClientsList:Array<any>;

  empty = true;

  clientSelected:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private db: AngularFireDatabase, private alertCtrl: AlertController,
              public firebaseApp: FirebaseApp, public popoverCtrl: PopoverController, public loadingProvider: LoadingProvider) {
    if(navParams.data.billingSelected){
      this.title = Translator.transform2('titleEdit_add_billing');

      let billing = navParams.data.billingSelected;

      if(billing.key)         this.keyBilling = billing.key;
      if(billing.code)        this.codeBilling = billing.code;
      if(billing.name)        this.nameBilling = billing.name;
      if(billing.description) this.descriptionBilling = billing.description;
      if(billing.client)      this.clientSelected = billing.client;

    } else this.title = Translator.transform2('titleAdd_add_billing');

    this.title_alert = Translator.transform2('title_saveAlert');
    this.subTitle_alert = Translator.transform2('subTitle_saveAlert');

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.billings = this.db.list('GEP/billings');
    this.clients = this.db.list('GEP/clients');

    this.clients.subscribe(itemList=>{
      let clients = [];

      itemList.forEach( item => {
        clients.push(item);
        return false;
      });
      this.clientsList = clients;
      this.loadedClientsList = clients;
    });
    this.loadingProvider.loadingDismiss();
  }

  ionViewDidLoad() {

  }

  onSubmit(f: NgForm) {
    if(f.valid && !this.navParams.data.billingSelected){
      let c = f.value;
      let key = this.billings.push({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        client: this.clientSelected || null,
      }).key;
      this.folder = '/GEP/billings/'+key;
      this.billings.update(key,{
        key: key,
      }).then(x => {
        this.navCtrl.pop();
      });
    } else if (f.valid && this.navParams.data.billingSelected){
      let c = f.value;
      this.db.object('GEP/billings/' + this.keyBilling).update({
        code: c.code || null,
        name: c.name || null,
        description: c.description || null,
        client: this.clientSelected || null,
      });
      this.folder = '/GEP/billings/'+this.keyBilling;
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

  getItems(searchBar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    let q = searchBar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      this.empty = true;
      return;
    } else this.empty = false;


    this.clientsList = this.clientsList.filter((v) => {
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
    this.clientsList = this.loadedClientsList;
  }

  selectClient(x){
    this.clientSelected = x;
  }

}
