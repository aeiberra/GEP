import {Component, Injectable, ViewChild} from '@angular/core';
import { NavController, Platform} from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Translator} from "../pipes/eigonic-translator/eigonic-translator";

import jQuery from 'jquery'

// Importing Providers
import { TabActive } from '../providers/tab-active';
import { PageActive } from '../providers/page-active';
import { AuthProvider } from '../providers/auth';

// Importing Pages
import { TabsPage } from '../pages/tabs/tabs';
import { ArticlePage } from '../pages/article/article';
import { PriceListPage } from '../pages/price-list/price-list';
import { ActualizacionPreciosPage } from "../pages/actualizacion-precios/actualizacion-precios";
import { ClientsPage } from "../pages/clients/clients";
import { CobranzaCTACTEPage } from "../pages/cobranza-ctacte/cobranza-ctacte";
import { DepositPage } from "../pages/deposit/deposit";
import { FamilyPage } from "../pages/family/family";
import { MovimientoStockPage } from "../pages/movimiento-stock/movimiento-stock";
import { PosPage } from "../pages/pos/pos";
import { ProveedoresPage } from "../pages/proveedores/proveedores";
import { SalesRSPage } from "../pages/salesRS/sales-RS";
import { SellersPage } from "../pages/sellers/sellers";
import { BrandsPage } from "../pages/brands/brands";
import { UsersPage } from "../pages/users/users";
import { LangBundle } from "../language/langBundle";
import { MeasurePage } from "../pages/measure/measure";
import { BranchPage } from "../pages/branch/branch";
import { ThemingPage } from '../pages/theming/theming';
import { TaxPage } from "../pages/tax/tax";
import { BillingPage } from "../pages/billing/billing";

// Importing Animations
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';



@Injectable()
export class WindowService {
  public window = window;
}

@Component({
  templateUrl: 'app.html',
  animations: [
    trigger('movePanel', [

      state('void', style({
        transform: 'translateY(-75%)', opacity: 0, offset: 1
      })),
      transition('* => *', animate(60))
    ])
  ]
})
export class MyApp {
  @ViewChild('secondContent') nav: NavController;

  previousPage:any;

  language:any;

  rootPage:any = TabsPage;
  selected:any;
  stateArticulos: boolean = false;
  statePrecios: boolean = false;
  stateDepositos: boolean = false;
  stateClientes: boolean = false;
  stateVendedores: boolean = false;
  stateVentas: boolean = false;
  stateProveedores: boolean = false;
  stateUsuarios: boolean = false;
  stateSucursales: boolean = false;
  pagesArticulos: Array<{title: string, component: any, icon: string, color: string}>;
  pagesPrecios: Array<{title: string, component: any, icon: string, color: string}>;
  pagesDepositos: Array<{title: string, component: any, icon: string, color: string}>;
  pagesClientes: Array<{title: string, component: any, icon: string, color: string}>;
  pagesVendedores: Array<{title: string, component: any, icon: string, color: string}>;
  pagesVentas: Array<{title: string, component: any, icon: string, color: string}>;
  pagesProveedores: Array<{title: string, component: any, icon: string, color: string}>;
  pagesUsuarios: Array<{title: string, component: any, icon: string, color: string}>;
  pagesSucursales: Array<{title: string, component: any, icon: string, color: string}>;

  //////// Pages ///////
  actualizacionPreciosPage = ActualizacionPreciosPage;
  articlePage = ArticlePage;
  clientsPage = ClientsPage;
  cobranzaCTACTEPage = CobranzaCTACTEPage;
  depositPage = DepositPage;
  familyPage = FamilyPage;
  priceListPage = PriceListPage;
  branchPage = BranchPage;
  brandsPage = BrandsPage;
  measurePage = MeasurePage;
  movimientoStockPage = MovimientoStockPage;
  posPage = PosPage;
  proveedoresPage = ProveedoresPage;
  billing = BillingPage;
  rutaVentasPage = SalesRSPage;
  vendedoresPage = SellersPage;
  crearUsuarioPage = UsersPage;
  themingPage = ThemingPage;
  taxPage = TaxPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public tabActive: TabActive, public pageActive: PageActive,
              private authProvider: AuthProvider, public navCtrl: NavController) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log(navigator.language.split('-')[0]);
      if(platform.is('cordova')){
        statusBar.styleDefault();
        splashScreen.hide();
      }
      this.language = localStorage.getItem('language');
      if(this.language){
        Translator.init(LangBundle.MSG, this.language)
      } else {
        Translator.init(LangBundle.MSG, navigator.language.split('-')[0]);
        this.language = navigator.language.split('-')[0];
      }
      // Translate
      let productsT:any = Translator.transform2('products');
      let familyT:any = Translator.transform2('family');
      let brandT:any = Translator.transform2('brand');
      let measureT:any = Translator.transform2('measure');
      let taxT:any = Translator.transform2('taxes');

      let priceListT:any = Translator.transform2('priceList');
      let massiveUpdateT:any = Translator.transform2('massiveUpdate');

      let stockMovementT:any = Translator.transform2('stockMovement');
      let stockControlT:any = Translator.transform2('stockControl');

      let clientsT:any = Translator.transform2('clients');
      let salesRouteSheetT:any = Translator.transform2('salesRouteSheet');

      let branchT:any = Translator.transform2('branches');

      let sellersT:any = Translator.transform2('sellers');

      let billingT:any = Translator.transform2('billingStation');
      let posT:any = Translator.transform2('pos');
      let collectionT:any = Translator.transform2('collectionofCTACTE');

      let suppliersT:any = Translator.transform2('suppliers');

      let usersT:any = Translator.transform2('users');

      this.pagesArticulos = [
        { title: productsT, component: this.articlePage, icon:"pricetag", color:"#5cb85c" },
        { title: familyT, component: this.familyPage, icon:"finger-print", color:"#5bc0de" },
        { title: brandT, component: this.brandsPage, icon:"flag", color:"#f0ad4e" },
        { title: measureT, component: this.measurePage, icon:"cube", color:"#f53d3d" }
      ];
      this.pagesPrecios = [
        { title: priceListT, component: this.priceListPage, icon:"clipboard", color:"#5cb85c" },
        { title: massiveUpdateT, component: this.actualizacionPreciosPage, icon:"checkbox", color:"#5bc0de" },
        { title: taxT, component: this.taxPage, icon:"logo-usd", color:"#f0ad4e" },
      ];
      this.pagesDepositos = [
        { title: stockMovementT, component: this.movimientoStockPage, icon:"pie", color:"#5cb85c" },
        { title: stockControlT, component: this.depositPage, icon:"information-circle", color:"#5bc0de" }
      ];
      this.pagesClientes = [
        { title: clientsT, component: this.clientsPage, icon:"contact", color:"#5cb85c" },
        { title: salesRouteSheetT, component: this.rutaVentasPage, icon:"globe", color:"#5bc0de" }
      ];
      this.pagesSucursales = [
        { title: branchT, component: this.branchPage, icon:"home", color:"#5cb85c" }
      ];
      this.pagesVendedores = [
        { title: sellersT, component: this.vendedoresPage, icon:"person", color:"#5cb85c" }
      ];
      this.pagesVentas = [
        { title: billingT, component: this.billing, icon:"cash", color:"#5cb85c" },
        { title: posT, component: this.posPage, icon:"phone-portrait", color:"#5bc0de" },
        { title: collectionT, component: this.cobranzaCTACTEPage, icon:"card", color:"#f0ad4e" }
      ];
      this.pagesProveedores = [
        { title: suppliersT, component: this.proveedoresPage, icon:"car", color:"#5cb85c" }
      ];
      this.pagesUsuarios = [
        { title: usersT, component: this.crearUsuarioPage, icon:"person-add", color:"#5cb85c" },
      ];
    });
  }

  goToOtherPage(page) {
      this.pageActive.changePage(page.component);
  }

  goToMercaderiaPage() {
      this.pageActive.goToMercaderiaPage();
  }

  goToVentasPage() {
    this.pageActive.goToVentasPage();
  }

  goToProveedoresPage() {
    this.pageActive.goToProveedoresPage();
  }

  goToConfigPage() {
    this.pageActive.goToConfigPage();
  }

  goToThemePage(){
    this.pageActive.changePage(this.themingPage);
  }

  logoutUser() {
    this.authProvider.logoutUser();
  }

  animateList(x) {
    switch(x) {
      case 'articulos': {
        this.stateArticulos = !this.stateArticulos;
        break;
      }
      case 'precios': {
        this.statePrecios = !this.statePrecios;
        break;
      }
      case 'depositos': {
        this.stateDepositos = !this.stateDepositos;
        break;
      }
      case 'clientes': {
        this.stateClientes = !this.stateClientes;
        break;
      }
      case 'vendedores': {
        this.stateVendedores = !this.stateVendedores;
        break;
      }
      case 'ventas': {
        this.stateVentas = !this.stateVentas;
        break;
      }
      case 'proveedores': {
        this.stateProveedores = !this.stateProveedores;
        break;
      }
      case 'usuarios': {
        this.stateUsuarios = !this.stateUsuarios;
        break;
      }
      case 'sucursales': {
        this.stateSucursales = !this.stateSucursales;
        break;
      }
    }
  }


}
