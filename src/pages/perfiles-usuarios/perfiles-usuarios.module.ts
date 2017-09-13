import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilesUsuariosPage } from './perfiles-usuarios';

@NgModule({
  declarations: [
    PerfilesUsuariosPage,
  ],
  imports: [
    IonicPageModule.forChild(PerfilesUsuariosPage),
  ],
  exports: [
    PerfilesUsuariosPage
  ]
})
export class PerfilesUsuariosModule {}
