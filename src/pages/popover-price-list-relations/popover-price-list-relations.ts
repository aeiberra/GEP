import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddPriceListPage} from "../add-price-list/add-price-list";
import {ThemeProvider} from "../../providers/theme/theme";

/**
 * Generated class for the PopoverPriceListRelationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-price-list-relations',
  templateUrl: 'popover-price-list-relations.html',
})
export class PopoverPriceListRelationsPage {

  searchQuery: string = '';
  priceLists:FirebaseListObservable<any[]>;
  selected:any;
  public priceListsList:Array<any>;
  public loadedPriceListsList:Array<any>;
  selectedTheme: String;

  titleDelete:any = Translator.transform2('titleDelete_add_priceList');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_priceList');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public viewCtrl: ViewController, public popoverCtrl: PopoverController,
              public settings: ThemeProvider) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);

  }

  ngOnInit() {
    if(this.navParams.data["0"].priceList){
      this.selected = this.navParams.data["0"].priceList.key;
    } else this.selected = null;

    this.priceLists = this.db.list('GEP/price-lists');

    this.priceLists.subscribe(itemList=>{
      let priceLists = [];

      itemList.forEach( item => {
        if(item.key == this.selected){
          item.selected = "itemSelected";
        }
        priceLists.push(item);
        return false;
      });
      this.priceListsList = priceLists;
      this.loadedPriceListsList = priceLists;
    });
  }

  ionViewDidLoad() {

  }

  addPriceList(){
    this.navCtrl.push(AddPriceListPage);
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

    this.priceListsList = this.priceListsList.filter((v) => {
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
    this.priceListsList = this.loadedPriceListsList;
  }

  selectItem(item) {
    this.viewCtrl.dismiss(item);
  }

}
