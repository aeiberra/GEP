import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddMeasurePage} from "../add-measure/add-measure";
import {ThemeProvider} from "../../providers/theme/theme";

/**
 * Generated class for the PopoverMeasureRelationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-measure-relations',
  templateUrl: 'popover-measure-relations.html',
})
export class PopoverMeasureRelationsPage {

  searchQuery: string = '';
  measures:FirebaseListObservable<any[]>;
  selected:any;
  public measuresList:Array<any>;
  public loadedMeasuresList:Array<any>;
  selectedTheme: String;

  titleDelete:any = Translator.transform2('titleDelete_add_measure');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_measure');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public viewCtrl: ViewController, public popoverCtrl: PopoverController,
              public settings: ThemeProvider) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);

  }

  ngOnInit() {
    if(this.navParams.data["0"].measure){
      this.selected = this.navParams.data["0"].measure.key;
    } else this.selected = null;

    this.measures = this.db.list('GEP/measures');

    this.measures.subscribe(itemList=>{
      let measures = [];

      itemList.forEach( item => {
        if(item.key == this.selected){
          item.selected = "itemSelected";
        }
        measures.push(item);
        return false;
      });
      this.measuresList = measures;
      this.loadedMeasuresList = measures;
    });
  }

  ionViewDidLoad() {

  }

  addMeasure(){
    this.navCtrl.push(AddMeasurePage);
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

  selectItem(item) {
    this.viewCtrl.dismiss(item);
  }

}
