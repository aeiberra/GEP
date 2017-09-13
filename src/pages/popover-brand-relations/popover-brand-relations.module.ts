import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverBrandRelationsPage } from './popover-brand-relations';

@NgModule({
  declarations: [
    PopoverBrandRelationsPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverBrandRelationsPage),
  ],
  exports: [
    PopoverBrandRelationsPage
  ]
})
export class PopoverBrandRelationsPageModule {}
