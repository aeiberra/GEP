import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeasurePage } from './measure';

@NgModule({
  declarations: [
    MeasurePage,
  ],
  imports: [
    IonicPageModule.forChild(MeasurePage),
  ],
  exports: [
    MeasurePage
  ]
})
export class MeasurePageModule {}
