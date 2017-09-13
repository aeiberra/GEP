import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Home } from './home';
import {Translator} from "../../pipes/eigonic-translator/eigonic-translator";
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar';

@NgModule({
  declarations: [
    Home,
    Translator,
    ProgressBarComponent
  ],
  imports: [
    IonicPageModule.forChild(Home),
  ],
  exports: [
    Home
  ]
})
export class HomeModule {}
