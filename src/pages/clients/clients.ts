import { Component } from '@angular/core';
import {AlertController, App, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';

import { AddClientPage } from "../add-client/add-client";
import {PopoverClientPage} from "../popover-client/popover-client";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
  selector: 'page-clientes',
  templateUrl: 'clients.html',
})
export class ClientsPage {
  searchQuery: string = '';
  clients:FirebaseListObservable<any[]>;
  client;
  public clientsList:Array<any>;
  public loadedClientsList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_client');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_client');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider, private app: App) {

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
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

  addClient(){
    this.navCtrl.push(AddClientPage);
  }

  viewClient(event, x:any) {
    // this.navCtrl.push(AddClientPage,{
    //   clientSelected: x
    // });
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

  getItems(searchBar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    let q = searchBar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

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

  deleteClient(x){
    let alert = this.alertCtrl.create({
      title: this.titleDelete,
      subTitle: this.subTitleDelete + ' '+ x.name + ' ' + x.surname +'?',
      buttons: [{
        text: 'Cancel',
        handler: data => {
        }
      },
        {
          text: 'Ok',
          handler: data => {
            this.db.object('GEP/clients/'+x.key).remove();
          }
        }]
    });
    alert.present();
  }

}
