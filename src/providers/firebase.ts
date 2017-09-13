import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class FirebaseProvider {
  firebaseConfig:any;

  constructor() {
    console.log('Hello FirebaseProvider Provider');
  }

}
