import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellersPage } from './sellers';

@NgModule({
  declarations: [
    SellersPage,
  ],
  imports: [
    IonicPageModule.forChild(SellersPage),
  ],
  exports: [
    SellersPage
  ]
})
export class VendedoresModule {}
