import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Translator} from "../../pipes/eigonic-translator/eigonic-translator";

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigTab {
  language:any;

  constructor(public navCtrl: NavController) {
    this.language = localStorage.getItem('language');
  }

  onChange(e){
    Translator.switchLang(e.toString());
    localStorage.setItem('language', e);
    window.location.reload();
  }

}
