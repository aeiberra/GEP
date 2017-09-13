import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrandsPage } from './brands';

@NgModule({
  declarations: [
    BrandsPage,
  ],
  imports: [
    IonicPageModule.forChild(BrandsPage),
  ],
  exports: [
    BrandsPage
  ]
})
export class MarcasModule {}
