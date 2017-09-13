import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPriceListPage } from './add-price-list';

@NgModule({
  declarations: [
    AddPriceListPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPriceListPage),
  ],
  exports: [
    AddPriceListPage
  ]
})
export class AddPriceListPageModule {}
