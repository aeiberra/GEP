import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDepositPage } from './add-deposit';

@NgModule({
  declarations: [
    AddDepositPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDepositPage),
  ],
  exports: [
    AddDepositPage
  ]
})
export class AddDepositPageModule {}
