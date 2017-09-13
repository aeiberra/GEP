import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddFamilyPage} from "../add-family/add-family";
import {PopoverFamilyPage} from "../popover-family/popover-family";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
  selector: 'page-family',
  templateUrl: 'family.html',
})
export class FamilyPage {
  searchQuery: string = '';
  familys:FirebaseListObservable<any[]>;
  family;
  public familysList:Array<any>;
  public loadedFamilysList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_family');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_family');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider) {

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.familys = this.db.list('GEP/family');

    this.familys.subscribe(itemList=>{
      let familys = [];

      itemList.forEach( item => {
        familys.push(item);
        return false;
      });
      this.familysList = familys;
      this.loadedFamilysList = familys;
    });
    this.loadingProvider.loadingDismiss();
  }

  ionViewDidLoad() {

  }

  addFamily(){
    this.navCtrl.push(AddFamilyPage);
  }

  viewFamily(event, x:any) {
    let popover = this.popoverCtrl.create(PopoverFamilyPage,x, {cssClass: 'family-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editFamily(popoverData);
    })
  }

  editFamily(x){
    this.navCtrl.push(AddFamilyPage,{
      familySelected: x
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

    this.familysList = this.familysList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1 || (v.code && v.code.toLowerCase().indexOf(q.toLowerCase()) > -1)
          || (v.description && v.description.toLowerCase().indexOf(q.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
    });
  }

  initializeItems(): void {
    this.familysList = this.loadedFamilysList;
  }

  deleteFamily(x){
    let alert = this.alertCtrl.create({
      title: this.titleDelete,
      subTitle: this.subTitleDelete + ' '+ x.name + '?',
      buttons: [{
        text: 'Cancel',
        handler: data => {
        }
      },
        {
          text: 'Ok',
          handler: data => {
            this.db.object('GEP/family/'+x.key).remove();
          }
        }]
    });
    alert.present();
  }

}
