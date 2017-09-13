import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverImageClientPage } from './popover-image-client';

@NgModule({
  declarations: [
    PopoverImageClientPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverImageClientPage),
  ],
  exports: [
    PopoverImageClientPage
  ]
})
export class PopoverImageClientPageModule {}
