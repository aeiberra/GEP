import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepositListPage } from './deposit-list';

@NgModule({
  declarations: [
    DepositListPage,
  ],
  imports: [
    IonicPageModule.forChild(DepositListPage),
  ],
  exports: [
    DepositListPage
  ]
})
export class DepositListPageModule {}
