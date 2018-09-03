import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProveedorProvider } from '../../providers/proveedor/proveedor';

/**
 * Generated class for the AgendaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
})
export class AgendaPage {
  detalleEvento
  fecha
  eventos: Array<any>=[
    {
      titulo: "Partido de Futbol",
      descripcion: "Dia 25/07/2018.Lugar la futbolera. Hora: 6:00 pm. Te esperamos con tu mama. Trae tu uniforme"

    },
    {
      titulo: "Conferencia ",
      descripcion: "Dia 25/07/2018.Lugar alcaldia. Hora: 6:00 pm. Te esperamos con tu familia"

    },
    {
      titulo: "Taller de pintura ",
      descripcion: "Dia 25/07/2018.Lugar Parque principal. Hora: 3:00 pm. Ven y diviertete"

    },
    {
      titulo: "Concierto",
      descripcion: "Dia 25/07/2018.Lugar Parque principal. Hora: 3:00 pm. Ven y escucha musica con tu familia"

    }

  ]
  constructor(public navCtrl: NavController, public navParams: NavParams,public proveedor:ProveedorProvider ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgendaPage');
    this.proveedor.obtenerEvento()
    
    .subscribe(
      (data)=>{this.detalleEvento=data;},
      (error)=> {console.log(error);}
    )
    alert(this.detalleEvento);
  }
  onDaySelect(event) {
    document.getElementById("info_eventos").style.display="block";
  
    
 }

}
