import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBillingPage } from './add-billing';

@NgModule({
  declarations: [
    AddBillingPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBillingPage),
  ],
})
export class AddBillingPageModule {}
