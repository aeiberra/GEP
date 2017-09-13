import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMeasurePage } from './add-measure';

@NgModule({
  declarations: [
    AddMeasurePage,
  ],
  imports: [
    IonicPageModule.forChild(AddMeasurePage),
  ],
  exports: [
    AddMeasurePage
  ]
})
export class AddMeasurePageModule {}
