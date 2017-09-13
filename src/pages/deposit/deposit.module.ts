import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepositPage } from './deposit';

@NgModule({
  declarations: [
    DepositPage,
  ],
  imports: [
    IonicPageModule.forChild(DepositPage),
  ],
  exports: [
    DepositPage
  ]
})
export class DepositModule {}
