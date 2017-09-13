import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ThemeProvider} from "../../providers/theme/theme";
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'page-theming',
  templateUrl: 'theming.html'
})
export class ThemingPage {
  selectedTheme: String;

  constructor(public navCtrl: NavController, private settings: ThemeProvider, private db: AngularFireDatabase) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  toggleAppTheme(val) {
    // switch(val) {
    //   case 'light-theme': {
    //     this.settings.setActiveTheme('light-theme');
    //     localStorage.setItem('theme','light-theme');
    //     this.db.app.database().ref('theme').set('light-theme');
    //     break;
    //   }
    //   case 'dark-theme': {
    //     this.settings.setActiveTheme('dark-theme');
    //     localStorage.setItem('theme','dark-theme');
    //     this.db.app.database().ref('theme').set('dark-theme');
    //     break;
    //   }
    // }
    this.settings.setActiveTheme(val);
    localStorage.setItem('theme',val);
    this.db.app.database().ref('theme').set(val);
  }
}
