import 'reflect-metadata';

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {ImageCropperComponent} from "ng2-img-cropper";
import { Translator } from '../pipes/eigonic-translator/eigonic-translator';

import { environment } from '../environments/environment';
import {IonicStorageModule} from "@ionic/storage";
import {LazyLoadImageModule} from "ng-lazyload-image";

// Importing AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule} from 'angularfire2/auth';

// Importing Providers
import { TabActive} from '../providers/tab-active';
import { PageActive } from '../providers/page-active';
import { AuthProvider } from '../providers/auth';
import { Permissions } from '../providers/permissions';
import { CryptoProvider } from '../providers/crypto';
import { HttpProvider } from "../providers/http";
import { FirebaseProvider } from '../providers/firebase';
import { MapService } from '../providers/map-service/map-service';
import { LoadingProvider } from '../providers/loading/loading';
import { ThemeProvider } from '../providers/theme/theme';

// Importing Pages
import { VentasTab } from '../pages/ventas/ventas';
import { ConfigTab } from '../pages/config/config';
import { MercaderiaTab } from '../pages/mercaderia/mercaderia';
import { ProveedoresTab } from '../pages/proveedores-tab/proveedores-tab';
import { TabsPage } from '../pages/tabs/tabs';
import { ArticlePage } from '../pages/article/article';
import { PriceListPage } from '../pages/price-list/price-list';
import { Home } from "../pages/home/home";
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
import { UsersPage } from '../pages/users/users';
import { PerfilesUsuariosPage } from '../pages/perfiles-usuarios/perfiles-usuarios';
import { AddClientPage } from "../pages/add-client/add-client";
import { PopoverClientPage } from "../pages/popover-client/popover-client";
import { PopoverImageClientPage } from "../pages/popover-image-client/popover-image-client";
import { AddArticlePage } from "../pages/add-article/add-article";
import { PopoverArticlePage } from "../pages/popover-article/popover-article";
import { PopoverImageArticlePage } from "../pages/popover-image-article/popover-image-article";
import { AddBrandPage } from "../pages/add-brand/add-brand";
import { PopoverBrandPage } from "../pages/popover-brand/popover-brand";
import { PopoverImageBrandPage } from "../pages/popover-image-brand/popover-image-brand";
import { AddDepositPage } from "../pages/add-deposit/add-deposit";
import { PopoverDepositPage } from "../pages/popover-deposit/popover-deposit";
import { PopoverImageDepositPage } from "../pages/popover-image-deposit/popover-image-deposit";
import { AddFamilyPage } from "../pages/add-family/add-family";
import { PopoverFamilyPage } from "../pages/popover-family/popover-family";
import { PopoverImageFamilyPage } from "../pages/popover-image-family/popover-image-family";
import { PopoverFamilyRelationsPage } from "../pages/popover-family-relations/popover-family-relations";
import { AddPriceListPage } from "../pages/add-price-list/add-price-list";
import { PopoverPriceListPage } from "../pages/popover-price-list/popover-price-list";
import { PopoverImagePriceListPage } from "../pages/popover-image-price-list/popover-image-price-list";
import { AddMeasurePage } from "../pages/add-measure/add-measure";
import { PopoverMeasurePage } from "../pages/popover-measure/popover-measure";
import { PopoverImageMeasurePage } from "../pages/popover-image-measure/popover-image-measure";
import { MeasurePage } from "../pages/measure/measure";
import { PopoverBrandRelationsPage } from "../pages/popover-brand-relations/popover-brand-relations";
import { PopoverMeasureRelationsPage } from "../pages/popover-measure-relations/popover-measure-relations";
import { PriceListListPage} from "../pages/price-list-list/price-list-list";
import { BranchPage} from "../pages/branch/branch";
import { AddBranchPage } from "../pages/add-branch/add-branch";
import { PopoverBranchPage } from "../pages/popover-branch/popover-branch";
import { PopoverImageBranchPage } from "../pages/popover-image-branch/popover-image-branch";
import { DepositListPage } from "../pages/deposit-list/deposit-list";
import { PopoverPriceListRelationsPage } from "../pages/popover-price-list-relations/popover-price-list-relations";
import { AddSellerPage } from "../pages/add-seller/add-seller";
import { PopoverSellerPage } from "../pages/popover-seller/popover-seller";
import { PopoverImageSellerPage } from "../pages/popover-image-seller/popover-image-seller";
import { PopoverDepositRelationsPage } from "../pages/popover-deposit-relations/popover-deposit-relations";
import { ThemingPage } from "../pages/theming/theming";
import { AddUserPage } from "../pages/add-user/add-user";
import { PopoverUserPage } from "../pages/popover-user/popover-user";
import { PopoverImageUserPage } from "../pages/popover-image-user/popover-image-user";
import { TaxPage } from "../pages/tax/tax";
import { AddTaxPage } from "../pages/add-tax/add-tax";
import { PopoverTaxPage } from "../pages/popover-tax/popover-tax";


// Animated
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import {AddSalesRSPage} from "../pages/add-sales-rs/add-sales-rs";
import {PopoverSalesRSPage} from "../pages/popover-sales-rs/popover-sales-rs";
import {PopoverImageSalesRSPage} from "../pages/popover-image-sales-rs/popover-image-sales-rs";
import {BillingPage} from "../pages/billing/billing";
import {AddBillingPage} from "../pages/add-billing/add-billing";
import {PopoverBillingPage} from "../pages/popover-billing/popover-billing";

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '0764f724'
  }
};

const firebaseConfig = {
  apiKey: localStorage.getItem('apiKey') || environment.firebase.apiKey,
  authDomain: localStorage.getItem('authDomain') || environment.firebase.authDomain,
  databaseURL: localStorage.getItem('databaseURL') || environment.firebase.databaseURL,
  projectId: localStorage.getItem('projectId') || environment.firebase.projectId,
  storageBucket: localStorage.getItem('storageBucket') || environment.firebase.storageBucket,
  messagingSenderId: localStorage.getItem('messagingSenderId') || environment.firebase.messagingSenderId,
};


@NgModule({
  declarations: [
    MyApp,
    VentasTab,
    ConfigTab,
    MercaderiaTab,
    ProveedoresTab,
    TabsPage,
    ArticlePage,
    PriceListPage,
    PriceListListPage,
    Home,
    ActualizacionPreciosPage,
    ClientsPage,
    CobranzaCTACTEPage,
    DepositPage,
    FamilyPage,
    MovimientoStockPage,
    PosPage,
    ProveedoresPage,
    SellersPage,
    AddSellerPage,
    PopoverSellerPage,
    PopoverImageSellerPage,
    BrandsPage,
    MeasurePage,
    UsersPage,
    AddUserPage,
    PopoverUserPage,
    PopoverImageUserPage,
    PerfilesUsuariosPage,
    Translator,
    ImageCropperComponent,
    AddClientPage,
    PopoverClientPage,
    PopoverImageClientPage,
    AddArticlePage,
    PopoverArticlePage,
    PopoverImageArticlePage,
    AddBrandPage,
    PopoverBrandPage,
    PopoverImageBrandPage,
    PopoverBrandRelationsPage,
    AddDepositPage,
    PopoverDepositPage,
    PopoverImageDepositPage,
    DepositListPage,
    PopoverDepositRelationsPage,
    AddFamilyPage,
    PopoverFamilyPage,
    PopoverImageFamilyPage,
    PopoverFamilyRelationsPage,
    AddPriceListPage,
    PopoverPriceListPage,
    PopoverImagePriceListPage,
    PopoverPriceListRelationsPage,
    AddMeasurePage,
    PopoverMeasurePage,
    PopoverImageMeasurePage,
    PopoverMeasureRelationsPage,
    ProgressBarComponent,
    BranchPage,
    AddBranchPage,
    PopoverBranchPage,
    PopoverImageBranchPage,
    ThemingPage,
    TaxPage,
    AddTaxPage,
    PopoverTaxPage,
    SalesRSPage,
    AddSalesRSPage,
    PopoverSalesRSPage,
    PopoverImageSalesRSPage,
    BillingPage,
    AddBillingPage,
    PopoverBillingPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(Home),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpModule,
    LazyLoadImageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    VentasTab,
    ConfigTab,
    MercaderiaTab,
    ProveedoresTab,
    TabsPage,
    ArticlePage,
    PriceListPage,
    PriceListListPage,
    Home,
    ActualizacionPreciosPage,
    ClientsPage,
    CobranzaCTACTEPage,
    DepositPage,
    FamilyPage,
    MovimientoStockPage,
    PosPage,
    ProveedoresPage,
    SellersPage,
    AddSellerPage,
    PopoverSellerPage,
    PopoverImageSellerPage,
    BrandsPage,
    MeasurePage,
    UsersPage,
    AddUserPage,
    PopoverUserPage,
    PopoverImageUserPage,
    PerfilesUsuariosPage,
    AddClientPage,
    PopoverClientPage,
    PopoverImageClientPage,
    AddArticlePage,
    PopoverArticlePage,
    PopoverImageArticlePage,
    AddBrandPage,
    PopoverBrandPage,
    PopoverImageBrandPage,
    PopoverBrandRelationsPage,
    AddDepositPage,
    PopoverDepositPage,
    PopoverImageDepositPage,
    DepositListPage,
    PopoverDepositRelationsPage,
    AddFamilyPage,
    PopoverFamilyPage,
    PopoverImageFamilyPage,
    PopoverFamilyRelationsPage,
    AddPriceListPage,
    PopoverPriceListPage,
    PopoverImagePriceListPage,
    PopoverPriceListRelationsPage,
    AddMeasurePage,
    PopoverMeasurePage,
    PopoverImageMeasurePage,
    PopoverMeasureRelationsPage,
    BranchPage,
    AddBranchPage,
    PopoverBranchPage,
    PopoverImageBranchPage,
    ThemingPage,
    TaxPage,
    AddTaxPage,
    PopoverTaxPage,
    SalesRSPage,
    AddSalesRSPage,
    PopoverSalesRSPage,
    PopoverImageSalesRSPage,
    BillingPage,
    AddBillingPage,
    PopoverBillingPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TabActive,
    PageActive,
    AuthProvider,
    Permissions,
    CryptoProvider,
    HttpProvider,
    FirebaseProvider,
    MapService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoadingProvider,
    ThemeProvider,
  ]
})
export class AppModule {}
