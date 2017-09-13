import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverImageBrandPage } from './popover-image-brand';

@NgModule({
  declarations: [
    PopoverImageBrandPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverImageBrandPage),
  ],
  exports: [
    PopoverImageBrandPage
  ]
})
export class PopoverImageBrandPageModule {}
