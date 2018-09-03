import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the RutaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ruta',
  templateUrl: 'ruta.html',
})
export class RutaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alerCtrl: AlertController) {
  }

  doAlert() {
    let alert = this.alerCtrl.create({
      title: 'Paso 1',
      message: 'Descripcion paso 1 Descripcion paso 1 Descripcion paso 1 Descripcion paso 1 Descripcion paso 1 Descripcion paso 1 Descripcion paso 1',
      buttons: ['Ok']
    });
    alert.present()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RutaPage');
  }

}
