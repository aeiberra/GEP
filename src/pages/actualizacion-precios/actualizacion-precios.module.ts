import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActualizacionPreciosPage } from './actualizacion-precios';

@NgModule({
  declarations: [
    ActualizacionPreciosPage,
  ],
  imports: [
    IonicPageModule.forChild(ActualizacionPreciosPage),
  ],
  exports: [
    ActualizacionPreciosPage
  ]
})
export class ActualizacionPreciosModule {}
