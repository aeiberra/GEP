import { Component, ViewChild } from '@angular/core';
import {NavController, Tabs} from "ionic-angular";

import { VentasTab } from '../ventas/ventas';
import { ConfigTab } from '../config/config';
import { MercaderiaTab } from '../mercaderia/mercaderia';
import { TabActive } from "../../providers/tab-active";
import {ProveedoresTab} from "../proveedores-tab/proveedores-tab";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('content') nav: NavController;

  previousPage:any;

  tab1Root = MercaderiaTab;
  tab2Root = VentasTab;
  tab3Root = ProveedoresTab;
  tab5Root = ConfigTab;

  @ViewChild('myTabs') tabRef: Tabs;


  constructor(public tabActive: TabActive) {
  };

  selected(x,y) {
    this.tabActive.changeTab(x,y)
  }

  public changePage(page){
    if(page != this.previousPage) {
      this.nav.push(page.component);
      this.previousPage = page;
    }
  }
}
