import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverImageDepositPage } from './popover-image-deposit';

@NgModule({
  declarations: [
    PopoverImageDepositPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverImageDepositPage),
  ],
  exports: [
    PopoverImageDepositPage
  ]
})
export class PopoverImageDepositPageModule {}
