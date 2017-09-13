import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable,} from 'angularfire2/database';

import { Translator } from '../../pipes/eigonic-translator/eigonic-translator';
import {AddDepositPage} from "../add-deposit/add-deposit";
import {ThemeProvider} from "../../providers/theme/theme";

/**
 * Generated class for the PopoverDepositRelationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-deposit-relations',
  templateUrl: 'popover-deposit-relations.html',
})
export class PopoverDepositRelationsPage {

  searchQuery: string = '';
  deposits:FirebaseListObservable<any[]>;
  deposit;
  selected:any;
  key:any;
  public depositsList:Array<any>;
  public loadedDepositsList:Array<any>;

  selectedTheme: String;

  titleDelete:any = Translator.transform2('titleDelete_add_deposit');
  subTitleDelete:any = Translator.transform2('subTitleDelete_add_deposit');

  constructor(public navCtrl: NavController,private db: AngularFireDatabase, public navParams: NavParams, public viewCtrl: ViewController, public popoverCtrl: PopoverController,
              public settings: ThemeProvider) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);

  }

  ngOnInit() {
    if(this.navParams.data["0"].deposit){
      this.selected = this.navParams.data["0"].deposit.key;
    } else this.selected = null;
    if(this.navParams.data["0"].key){
      this.key = this.navParams.data["0"].key
    }

    this.deposits = this.db.list('GEP/deposit');

    this.deposits.subscribe(itemList=>{
      let deposits = [];

      itemList.forEach( item => {
        if(item.key == this.selected){
          item.selected = "itemSelected";
        }
        if(item.key == this.key){
          item.currentKey = true;
        }
        deposits.push(item);
        return false;
      });
      this.depositsList = deposits;
      this.loadedDepositsList = deposits;
    });

    this.deposit = this.db.object('GEP/deposit/')
  }

  ionViewDidLoad() {

  }

  addDeposit(){
    this.navCtrl.push(AddDepositPage);
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

    this.depositsList = this.depositsList.filter((v) => {
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
    this.depositsList = this.loadedDepositsList;
  }

  selectItem(item) {
    this.viewCtrl.dismiss(item);
  }

}
