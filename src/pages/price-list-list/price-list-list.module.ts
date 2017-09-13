import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PriceListListPage } from './price-list-list';

@NgModule({
  declarations: [
    PriceListListPage,
  ],
  imports: [
    IonicPageModule.forChild(PriceListListPage),
  ],
  exports: [
    PriceListListPage
  ]
})
export class PriceListListPageModule {}
