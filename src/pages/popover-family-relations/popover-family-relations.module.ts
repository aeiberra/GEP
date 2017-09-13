import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverFamilyRelationsPage } from './popover-family-relations';

@NgModule({
  declarations: [
    PopoverFamilyRelationsPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverFamilyRelationsPage),
  ],
  exports: [
    PopoverFamilyRelationsPage
  ]
})
export class PopoverFamilyRelationsPageModule {}
