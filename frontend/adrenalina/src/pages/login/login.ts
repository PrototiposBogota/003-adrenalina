import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { HomePage } from '../home/home';
import { NuevoUsuarioPage } from '../nuevo-usuario/nuevo-usuario';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

usuario={
email:"",
password1:""
}

  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth) {

  }
  registrar(){
    this.navCtrl.push(NuevoUsuarioPage);
  }
  ingresa(){
    this.navCtrl.push(HomePage);
  }

  iniciarSesionFacebook(){
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    .then(resultado=>console.log(resultado));
  }
}
