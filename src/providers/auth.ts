import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';
import {App} from "ionic-angular";

@Injectable()
export class AuthProvider {

  constructor(public afAuth: AngularFireAuth, private app: App) {
  }


  loginUser(newEmail: string, newPassword: string): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword)
  }
  resetPassword(email: string): firebase.Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email)
  }
  logoutUser(): firebase.Promise<any> {
    return this.afAuth.auth.signOut().then(x => {
      this.app.getRootNavs().pop();
      this.app.getRootNav().setRoot('LoginPage');
      // this.app.getActiveNav().popToRoot();
    });
  }
  signupUser(newEmail: string, newPassword: string): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPassword);
  }

  loginSucess() {

  }

}
