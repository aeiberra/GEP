import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverImageSellerPage } from './popover-image-seller';

@NgModule({
  declarations: [
    PopoverImageSellerPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverImageSellerPage),
  ],
  exports: [
    PopoverImageSellerPage
  ]
})
export class PopoverImageSellerPageModule {}
