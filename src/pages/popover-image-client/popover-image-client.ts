import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {ImageCropperComponent,CropperSettings} from "ng2-img-cropper";

/**
 * Generated class for the PopoverImageClientPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-image-client',
  templateUrl: 'popover-image-client.html',
})
export class PopoverImageClientPage {
  data1:any;
  cropperSettings1:CropperSettings;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  photoClient:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {

    this.cropperSettings1 = new CropperSettings();
    this.cropperSettings1.width = 300;
    this.cropperSettings1.height = 300;
    this.cropperSettings1.croppedWidth = 300;
    this.cropperSettings1.croppedHeight = 300;
    this.cropperSettings1.canvasWidth = 300;
    this.cropperSettings1.canvasHeight = 300;
    this.cropperSettings1.minWidth = 75;
    this.cropperSettings1.minHeight = 75;
    this.cropperSettings1.rounded = true;
    this.cropperSettings1.keepAspect = true;
    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(222,222,222,1)';
    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;
    this.data1 = {};
  }

  ionViewDidLoad() {
    this.photoClient = this.navParams.data["0"].photo;
  }

  fileChangeListener($event) {
    let image:any = new Image();
    let file:File = $event.target.files[0];
    let myReader:FileReader = new FileReader();
    let that = this;
    myReader.onloadend = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
  }

  uploadImage(){
    this.viewCtrl.dismiss(this.data1);
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
