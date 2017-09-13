import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverDepositPage } from './popover-deposit';

@NgModule({
  declarations: [
    PopoverDepositPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverDepositPage),
  ],
  exports: [
    PopoverDepositPage
  ]
})
export class PopoverDepositPageModule {}
