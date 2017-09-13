import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProveedoresTab } from './proveedores-tab';

@NgModule({
  declarations: [
    ProveedoresTab,
  ],
  imports: [
    IonicPageModule.forChild(ProveedoresTab),
  ],
  exports: [
    ProveedoresTab
  ]
})
export class ProveedoresTabModule {}
