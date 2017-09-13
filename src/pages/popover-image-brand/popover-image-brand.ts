import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {ImageCropperComponent,CropperSettings} from "ng2-img-cropper";

@IonicPage()
@Component({
  selector: 'page-popover-image-brand',
  templateUrl: 'popover-image-brand.html',
})
export class PopoverImageBrandPage {
  data1:any;
  cropperSettings1:CropperSettings;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  photoBrand:any;

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
    this.photoBrand = this.navParams.data["0"].photo;
    console.log(this.navParams);
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
