import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BranchPage } from './branch';

@NgModule({
  declarations: [
    BranchPage,
  ],
  imports: [
    IonicPageModule.forChild(BranchPage),
  ],
  exports: [
    BranchPage
  ]
})
export class BranchPageModule {}
