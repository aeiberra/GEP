import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesRSPage } from './sales-RS';

@NgModule({
  declarations: [
    SalesRSPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesRSPage),
  ],
  exports: [
    SalesRSPage
  ]
})
export class SalesRSModule {}
