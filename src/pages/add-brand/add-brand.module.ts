import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBrandPage } from './add-brand';

@NgModule({
  declarations: [
    AddBrandPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBrandPage),
  ],
  exports: [
    AddBrandPage
  ]
})
export class AddBrandPageModule {}
