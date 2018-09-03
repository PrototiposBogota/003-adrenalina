import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';

import * as firebase from 'firebase/app';
import { templateJitUrl } from '../../../node_modules/@angular/compiler';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-nuevo-usuario',
  templateUrl: 'nuevo-usuario.html',
})
export class NuevoUsuarioPage {

  usuario = {
    email: "",
    password1: "",
    password2: ""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private servicioUsuarios: UsuarioProvider) {
  }
 

  crearCuenta() {
    if (this.usuario.password1 !== this.usuario.password2) {
      this.servicioUsuarios.alerta("Error contraseña", "Las contraseñas no coinciden");
      this.usuario.password1 = "";
      this.usuario.password2 = "";

    } else {
      this.servicioUsuarios.crearCuenta(this.usuario.email, this.usuario.password1)
        .then(resultado => {
          this.navCtrl.push(HomePage);
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoUsuarioPage');
  }

}
