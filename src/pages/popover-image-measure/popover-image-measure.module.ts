import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverImageMeasurePage } from './popover-image-measure';

@NgModule({
  declarations: [
    PopoverImageMeasurePage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverImageMeasurePage),
  ],
  exports: [
    PopoverImageMeasurePage
  ]
})
export class PopoverImageMeasurePageModule {}
