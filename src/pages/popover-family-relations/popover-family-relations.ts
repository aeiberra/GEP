import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddFamilyPage} from "../add-family/add-family";
import {ThemeProvider} from "../../providers/theme/theme";

/**
 * Generated class for the PopoverFamilyRelationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-family-relations',
  templateUrl: 'popover-family-relations.html',
})
export class PopoverFamilyRelationsPage {

  searchQuery: string = '';
  familys:FirebaseListObservable<any[]>;
  family;
  selected:any;
  key:any;
  public familysList:Array<any>;
  public loadedFamilysList:Array<any>;

  selectedTheme: String;

  titleDelete:any = Translator.transform2('titleDelete_add_family');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_family');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public viewCtrl: ViewController, public popoverCtrl: PopoverController,
              public settings: ThemeProvider) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);

  }

  ngOnInit() {
    if(this.navParams.data["0"].family){
      this.selected = this.navParams.data["0"].family.key;
    } else this.selected = null;
    if(this.navParams.data["0"].key){
      this.key = this.navParams.data["0"].key
    }

    this.familys = this.db.list('GEP/family');

    this.familys.subscribe(itemList=>{
      let familys = [];

      itemList.forEach( item => {
        if(item.key == this.selected){
          item.selected = "itemSelected";
        }
        if(item.key == this.key){
          item.currentKey = true;
        }
        familys.push(item);
        return false;
      });
      this.familysList = familys;
      this.loadedFamilysList = familys;
    });

    this.family = this.db.object('GEP/family/')
  }

  ionViewDidLoad() {

  }

  addFamily(){
    this.navCtrl.push(AddFamilyPage);
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

  selectItem(item) {
    this.viewCtrl.dismiss(item);
  }

}
