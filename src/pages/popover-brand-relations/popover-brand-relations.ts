import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddBrandPage} from "../add-brand/add-brand";
import {ThemeProvider} from "../../providers/theme/theme";

/**
 * Generated class for the PopoverBrandRelationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-brand-relations',
  templateUrl: 'popover-brand-relations.html',
})
export class PopoverBrandRelationsPage {

  searchQuery: string = '';
  brands:FirebaseListObservable<any[]>;
  selected:any;
  public brandsList:Array<any>;
  public loadedBrandsList:Array<any>;

  selectedTheme: String;

  titleDelete:any = Translator.transform2('titleDelete_add_brand');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_brand');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public viewCtrl: ViewController, public popoverCtrl: PopoverController,
              public settings: ThemeProvider) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);

  }

  ngOnInit() {
    if(this.navParams.data["0"].brand){
      this.selected = this.navParams.data["0"].brand.key;
    } else this.selected = null;

    this.brands = this.db.list('GEP/brands');

    this.brands.subscribe(itemList=>{
      let brands = [];

      itemList.forEach( item => {
        if(item.key == this.selected){
          item.selected = "itemSelected";
        }
        brands.push(item);
        return false;
      });
      this.brandsList = brands;
      this.loadedBrandsList = brands;
    });
  }

  ionViewDidLoad() {

  }

  addBrand(){
    this.navCtrl.push(AddBrandPage);
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

    this.brandsList = this.brandsList.filter((v) => {
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
    this.brandsList = this.loadedBrandsList;
  }

  selectItem(item) {
    this.viewCtrl.dismiss(item);
  }

}
