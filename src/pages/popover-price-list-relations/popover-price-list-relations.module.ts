import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverPriceListRelationsPage } from './popover-price-list-relations';

@NgModule({
  declarations: [
    PopoverPriceListRelationsPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverPriceListRelationsPage),
  ],
  exports: [
    PopoverPriceListRelationsPage
  ]
})
export class PopoverPriceListRelationsPageModule {}
