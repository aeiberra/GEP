import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MovimientoStockPage } from './movimiento-stock';

@NgModule({
  declarations: [
    MovimientoStockPage,
  ],
  imports: [
    IonicPageModule.forChild(MovimientoStockPage),
  ],
  exports: [
    MovimientoStockPage
  ]
})
export class MovimientoStockModule {}
