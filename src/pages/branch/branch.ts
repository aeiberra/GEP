import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';

import { AddBranchPage } from "../add-branch/add-branch";
import {PopoverBranchPage} from "../popover-branch/popover-branch";
import {LoadingProvider} from "../../providers/loading/loading";
import {HttpProvider} from "../../providers/http";

@IonicPage()
@Component({
  selector: 'page-branches',
  templateUrl: 'branch.html',
})
export class BranchPage {
  searchQuery: string = '';
  branchs:FirebaseListObservable<any[]>;
  branch;
  public branchsList:Array<any>;
  public loadedBranchsList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_branch');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_branch');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider, public http: HttpProvider) {

    this.loadingProvider.loadingPresent();
    setTimeout(()=>{
      this.loadingProvider.loadingDismiss();
    },7000);
    let key = {
      key: "token",
      name: localStorage.getItem('name')
    };
    this.http.branchObtain(key);
    this.http.branch.subscribe(y=> {
      y = JSON.parse(y);
      if (y && y.s) {
        y.s.results.forEach(x=>{
          this.db.object('GEP/branchs/' + x.id).update({
            key: x.id,
            code: x.id,
            email: x.mail || null,
            name: x.nombre || null,
            phone: x.telefono || null,
            address: {
              0: {
                address: (x.calle || null) + ' ' + (x.ciudad),
                code: 0,
                latLngBranch: {
                  longitude: x.longitud || null,
                  latitude: x.latitud || null
                }
              }
            }
          });
        });
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

  ngOnInit() {
    // this.loadingProvider.loadingPresent();
    this.branchs = this.db.list('GEP/branchs');

    this.branchs.subscribe(itemList=>{
      let branchs = [];

      itemList.forEach( item => {
        branchs.push(item);
        return false;
      });
      this.branchsList = branchs;
      this.loadedBranchsList = branchs;
    });
    // this.loadingProvider.loadingDismiss();
  }

  ionViewDidLoad() {

  }

  addBranch(){
    this.navCtrl.push(AddBranchPage);
  }

  viewBranch(event, x:any) {
    // this.navCtrl.push(AddBranchPage,{
    //   branchSelected: x
    // });
    let popover = this.popoverCtrl.create(PopoverBranchPage,x, {cssClass: 'branch-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editBranch(popoverData);
    })
  }

  editBranch(x){
    this.navCtrl.push(AddBranchPage,{
      branchSelected: x
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

    this.branchsList = this.branchsList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1
          || (v.phone && v.phone.toLowerCase().indexOf(q.toLowerCase()) > -1) || (v.code && v.code.toLowerCase().indexOf(q.toLowerCase()) > -1)
          || (v.address[0].address && v.address[0].address.toLowerCase().indexOf(q.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
    });
  }

  initializeItems(): void {
    this.branchsList = this.loadedBranchsList;
  }

  deleteBranch(x){
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
            this.db.object('GEP/branchs/'+x.key).remove();
          }
        }]
    });
    alert.present();
  }

}
