import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverClientPage } from './popover-client';

@NgModule({
  declarations: [
    PopoverClientPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverClientPage),
  ],
  exports: [
    PopoverClientPage
  ]
})
export class PopoverClientPageModule {}
