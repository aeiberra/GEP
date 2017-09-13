import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CobranzaCTACTEPage } from './cobranza-ctacte';

@NgModule({
  declarations: [
    CobranzaCTACTEPage,
  ],
  imports: [
    IonicPageModule.forChild(CobranzaCTACTEPage),
  ],
  exports: [
    CobranzaCTACTEPage
  ]
})
export class CobranzaCTACTEModule {}
