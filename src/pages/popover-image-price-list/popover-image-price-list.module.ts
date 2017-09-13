import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverImagePriceListPage } from './popover-image-price-list';

@NgModule({
  declarations: [
    PopoverImagePriceListPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverImagePriceListPage),
  ],
  exports: [
    PopoverImagePriceListPage
  ]
})
export class PopoverImagePriceListPageModule {}
