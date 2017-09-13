import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverMeasurePage } from './popover-measure';

@NgModule({
  declarations: [
    PopoverMeasurePage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverMeasurePage),
  ],
  exports: [
    PopoverMeasurePage
  ]
})
export class PopoverMeasurePageModule {}
