import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverBrandPage } from './popover-brand';

@NgModule({
  declarations: [
    PopoverBrandPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverBrandPage),
  ],
  exports: [
    PopoverBrandPage
  ]
})
export class PopoverBrandPageModule {}
