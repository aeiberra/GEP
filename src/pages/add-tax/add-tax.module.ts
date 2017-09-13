import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTaxPage } from './add-tax';

@NgModule({
  declarations: [
    AddTaxPage,
  ],
  imports: [
    IonicPageModule.forChild(AddTaxPage),
  ],
})
export class AddTaxPageModule {}
