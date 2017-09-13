import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";

import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class Permissions {
  user: Observable<firebase.User>;
  list: FirebaseListObservable<any[]>;
  profiles: FirebaseListObservable<any[]>;

  public pagesArray: Array<{page:string,write:boolean,read:boolean}>;
  public tabArray: Array<{tab:string,write:boolean,read:boolean}>;

  constructor(public db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.pagesArray = [
      { page: 'actualizacionPreciosPage',     write: false, read: false },
      { page: 'articulosPage',                write: false, read: false },
      { page: 'clientsPage',                  write: false, read: false },
      { page: 'cobranzaCTACTEPage',           write: false, read: false },
      { page: 'depositPage',                  write: false, read: false },
      { page: 'familyPage',                   write: false, read: false },
      { page: 'priceListPage',                write: false, read: false },
      { page: 'brandsPage',                   write: false, read: false },
      { page: 'movimientoStockPage',          write: false, read: false },
      { page: 'posPage',                      write: false, read: false },
      { page: 'proveedoresPage',              write: false, read: false },
      { page: 'puestoFacturacionPage',        write: false, read: false },
      { page: 'rutaVentasPage',               write: false, read: false },
      { page: 'vendedoresPage',               write: false, read: false },
      { page: 'crearUsuarioPage',             write: false, read: false },
      { page: 'perfilesUsuariosPage',         write: false, read: false }
    ];
    this.tabArray = [
      { tab: 'ventasTab',                     write: false, read: false },
      { tab: 'configTab',                     write: false, read: false },
      { tab: 'mercaderiaTab',                 write: false, read: false },
      { tab: 'proveedoresTab',                write: false, read: false }
    ];
    this.profiles = db.list('config/profiles');
    this.profiles.subscribe(profiles => {
      console.log(profiles);
    });
  }

}
