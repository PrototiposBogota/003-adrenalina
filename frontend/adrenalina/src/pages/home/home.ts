import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RutaPage } from '../ruta/ruta';
import { AgendaPage } from '../agenda/agenda';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
  opcion_agenda(){
    this.navCtrl.push(AgendaPage);
  }
  opcion_ruta(){
    this.navCtrl.push(RutaPage);
  }


}
