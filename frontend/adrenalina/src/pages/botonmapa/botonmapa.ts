import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { map } from 'rxjs/operators';
import { GESTURE_PRIORITY_TOGGLE } from 'ionic-angular/umd/gestures/gesture-controller';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-botonmapa',
  templateUrl: 'botonmapa.html',
})
export class BotonmapaPage {

  @ViewChild('map') mapRef: ElementRef;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BotonmapaPage');
    this.showMap();
  }
  showMap(){
    //Localizacion - Latitud Longitud
    const location = new google.maps.LatLng(4.6097100, -74.0817500);
    // Opciones de Mapa
    const options = {
      center: location,
      zoom: 15,
      mapTypeId: 'satellite'
    }
    const map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.addMarker(location, map);
  }
  //Marcador en Mapa
  addMarker(position, map){
    return new google.maps.Marker({
      position, 
      map
    });

  }
}
