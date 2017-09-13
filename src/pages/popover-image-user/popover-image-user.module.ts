import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverImageUserPage } from './popover-image-user';

@NgModule({
  declarations: [
    PopoverImageUserPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverImageUserPage),
  ],
})
export class PopoverImageUserPageModule {}
