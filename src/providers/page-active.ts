import {Injectable, ViewChild} from '@angular/core';
import 'rxjs/add/operator/map';
import {App, NavController} from 'ionic-angular';
import { MercaderiaTab } from '../pages/mercaderia/mercaderia'
import {VentasTab} from "../pages/ventas/ventas";
import {ProveedoresTab} from "../pages/proveedores-tab/proveedores-tab";
import {ConfigTab} from "../pages/config/config";


/*
  Generated class for the PageActive provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PageActive {
  @ViewChild('secondContent') nav: NavController;

  mercaderiaPage = MercaderiaTab;
  ventasPage = VentasTab;
  proveedoresPage = ProveedoresTab;
  configPage = ConfigTab;

  previousPage: any = '';

  constructor(private app: App) {
    console.log('Hello PageActive Provider');
  }

  destroyPreviousPage() {
    this.app.getActiveNav().first();
  }

  changePage(x) {
    if(x != this.previousPage) {
      this.app.getActiveNav().push(x);
      this.previousPage = x;
    }
  }

  goToMercaderiaPage() {
    this.destroyPreviousPage();
    this.previousPage = '';
    this.app.getActiveNav().setRoot(this.mercaderiaPage);
  }

  goToVentasPage() {
    this.destroyPreviousPage();
    this.previousPage = '';
    this.app.getActiveNav().setRoot(this.ventasPage);
  }

  goToProveedoresPage() {
    this.destroyPreviousPage();
    this.previousPage = '';
    this.app.getActiveNav().setRoot(this.proveedoresPage);
  }

  goToConfigPage() {
    this.destroyPreviousPage();
    this.previousPage = '';
    this.app.getActiveNav().setRoot(this.configPage);
  }

}
