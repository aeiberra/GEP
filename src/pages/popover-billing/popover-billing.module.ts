import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverBillingPage } from './popover-billing';

@NgModule({
  declarations: [
    PopoverBillingPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverBillingPage),
  ],
})
export class PopoverBillingPageModule {}
