import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Translator} from "../../pipes/eigonic-translator/eigonic-translator";
import {LoadingController} from "ionic-angular";

@Injectable()
export class LoadingProvider {
  loader:any;
  loadingData:any = Translator.transform2('loadingData');

  constructor(public loading: LoadingController) {

  }

  public loadingPresent(){
    this.loader = this.loading.create({
      content: this.loadingData,
    });
    this.loader.present();
  }

  public loadingDismiss(){
    if(this.loader) {
      this.loader.dismiss();
    }
  }

}
