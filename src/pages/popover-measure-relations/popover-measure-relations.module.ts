import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverMeasureRelationsPage } from './popover-measure-relations';

@NgModule({
  declarations: [
    PopoverMeasureRelationsPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverMeasureRelationsPage),
  ],
  exports: [
    PopoverMeasureRelationsPage
  ]
})
export class PopoverMeasureRelationsPageModule {}
