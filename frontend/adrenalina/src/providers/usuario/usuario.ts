import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AlertController } from 'ionic-angular';


@Injectable()
export class UsuarioProvider {

  constructor(
    private alertController: AlertController,
    private afAuth: AngularFireAuth,
  ) {
    console.log('Hello UsuarioProvider Provider');
  }

  alerta(titulo, subtitulo) {
    let alerta = this.alertController.create({
      title: titulo,
      subTitle: subtitulo,
      buttons: ['Listo']
    });
    alerta.present();
  }

  crearCuenta(email, contraseña) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, contraseña)
      .then(resultado => console.log(resultado))
      .catch(error => this.alerta("Error", error));
  }

}
