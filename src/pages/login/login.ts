import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  LoadingController,
  Loading,
  AlertController
} from 'ionic-angular';

// Validate forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Import provider
import { AuthProvider } from '../../providers/auth';
import { HttpProvider } from "../../providers/http";

// Import Page

// Import Validator Email
import { EmailValidator } from '../../validators/email';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm:FormGroup;
  loading:Loading;

  constructor(public navCtrl: NavController, public authData: AuthProvider,
              public formBuilder: FormBuilder, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController, public http: HttpProvider) {
    // Validator Email
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required,
        EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6),
        Validators.required])]
    });
  }

  loginUser(){
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.http.searchUser(this.loginForm.value.email,this.loginForm.value.password);
    }
  }

  goToResetPassword() {
    this.navCtrl.push('ResetPasswordPage');
  }

  createAccount() {
    this.navCtrl.push('SignupPage');
  }

}
