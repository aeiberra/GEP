import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverPriceListPage } from './popover-price-list';

@NgModule({
  declarations: [
    PopoverPriceListPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverPriceListPage),
  ],
  exports: [
    PopoverPriceListPage
  ]
})
export class PopoverPriceListPageModule {}
