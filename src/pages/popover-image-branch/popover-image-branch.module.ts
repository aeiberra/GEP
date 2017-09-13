import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverImageBranchPage } from './popover-image-branch';

@NgModule({
  declarations: [
    PopoverImageBranchPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverImageBranchPage),
  ],
  exports: [
    PopoverImageBranchPage
  ]
})
export class PopoverImageBranchPageModule {}
