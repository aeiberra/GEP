import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';

import { AddUserPage } from "../add-user/add-user";
import {PopoverUserPage} from "../popover-user/popover-user";
import {LoadingProvider} from "../../providers/loading/loading";
import {HttpProvider} from "../../providers/http";

@IonicPage()
@Component({
  selector: 'page-useres',
  templateUrl: 'users.html',
})
export class UsersPage {
  searchQuery: string = '';
  users:FirebaseListObservable<any[]>;
  user;
  public usersList:Array<any>;
  public loadedUsersList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_user');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_user');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider, private http: HttpProvider) {
  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.users = this.db.list('GEP/users');

    this.users.subscribe(itemList=>{
      let users = [];

      itemList.forEach( item => {
        if(item.email) item.email = item.email.replace(/{punto}/g,'.');
        users.push(item);
        return false;
      });
      this.usersList = users;
      this.loadedUsersList = users;
    });
    this.loadingProvider.loadingDismiss();
  }

  ionViewDidLoad() {

  }

  addUser(){
    this.navCtrl.push(AddUserPage);
  }

  viewUser(event, x:any) {
    // this.navCtrl.push(AddUserPage,{
    //   userSelected: x
    // });
    let popover = this.popoverCtrl.create(PopoverUserPage,x, {cssClass: 'user-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editUser(popoverData);
    })
  }

  editUser(x){
    this.navCtrl.push(AddUserPage,{
      userSelected: x
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

    this.usersList = this.usersList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1 || (v.surname && v.surname.toLowerCase().indexOf(q.toLowerCase()) > -1)
          || (v.phone && v.phone.toLowerCase().indexOf(q.toLowerCase()) > -1) || (v.code && v.code.toLowerCase().indexOf(q.toLowerCase()) > -1)
        ) {
          return true;
        }
        return false;
      }
    });
  }

  initializeItems(): void {
    this.usersList = this.loadedUsersList;
  }

  deleteUser(x){
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
            this.loadingProvider.loadingPresent();
            setTimeout(()=>{
              this.loadingProvider.loadingDismiss();
            },7000);
            let key = {
              key: x.key,
              name: localStorage.getItem('name'),
              email: x.email
            };
            this.http.deleteUser(key);
            this.http.userUser.subscribe(y=> {
              y = JSON.parse(y);
              if (y && y.s) {
                this.db.object('GEP/users/'+x.key).remove();
                this.loadingProvider.loadingDismiss();
              } else if(y && y.e) {
                let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: y.e.message,
                  buttons: ['OK']
                });
                alert.present();
                this.loadingProvider.loadingDismiss();
              }
            });
          }
        }]
    });
    alert.present();
  }

}
