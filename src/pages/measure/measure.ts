import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddMeasurePage} from "../add-measure/add-measure";
import {PopoverMeasurePage} from "../popover-measure/popover-measure";
import {LoadingProvider} from "../../providers/loading/loading";

@IonicPage()
@Component({
  selector: 'page-measure',
  templateUrl: 'measure.html',
})
export class MeasurePage {
  searchQuery: string = '';
  measures:FirebaseListObservable<any[]>;
  measure;
  public measuresList:Array<any>;
  public loadedMeasuresList:Array<any>;

  titleDelete:any = Translator.transform2('titleDelete_add_measure');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_measure');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl: AlertController,
              public loadingProvider: LoadingProvider) {

  }

  ngOnInit() {
    this.loadingProvider.loadingPresent();
    this.measures = this.db.list('GEP/measures');

    this.measures.subscribe(itemList=>{
      let measures = [];

      itemList.forEach( item => {
        measures.push(item);
        return false;
      });
      this.measuresList = measures;
      this.loadedMeasuresList = measures;
    });
    this.loadingProvider.loadingDismiss();
  }

  ionViewDidLoad() {

  }

  addMeasure(){
    this.navCtrl.push(AddMeasurePage);
  }

  viewMeasure(event, x:any) {
    let popover = this.popoverCtrl.create(PopoverMeasurePage,x, {cssClass: 'measure-popover'});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((popoverData) => {
      if(popoverData) this.editMeasure(popoverData);
    })
  }

  editMeasure(x){
    this.navCtrl.push(AddMeasurePage,{
      measureSelected: x
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

    this.measuresList = this.measuresList.filter((v) => {
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
    this.measuresList = this.loadedMeasuresList;
  }

  deleteMeasure(x){
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
            this.db.object('GEP/measures/'+x.key).remove();
          }
        }]
    });
    alert.present();
  }

}
