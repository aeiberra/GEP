import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverBranchPage } from './popover-branch';

@NgModule({
  declarations: [
    PopoverBranchPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverBranchPage),
  ],
  exports: [
    PopoverBranchPage
  ]
})
export class PopoverBranchPageModule {}
