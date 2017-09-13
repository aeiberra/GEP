import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class CryptoProvider {
  public CryptoJS = require('crypto-js');
  public AES = require('crypto-js/aes');

  constructor() {
    console.log("CryptoJS",this.CryptoJS);
    console.log(this.AES.encrypt('tumama', 'TUPRIMA'));
  }

}
