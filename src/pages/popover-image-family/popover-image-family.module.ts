import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverImageFamilyPage } from './popover-image-family';

@NgModule({
  declarations: [
    PopoverImageFamilyPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverImageFamilyPage),
  ],
  exports: [
    PopoverImageFamilyPage
  ]
})
export class PopoverImageFamilyPageModule {}
