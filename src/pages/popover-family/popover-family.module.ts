import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverFamilyPage } from './popover-family';

@NgModule({
  declarations: [
    PopoverFamilyPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverFamilyPage),
  ],
  exports: [
    PopoverFamilyPage
  ]
})
export class PopoverFamilyPageModule {}
