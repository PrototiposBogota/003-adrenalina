import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { NuevoUsuarioPage } from '../pages/nuevo-usuario/nuevo-usuario';
import { PerfilUsuarioPage } from '../pages/perfil-usuario/perfil-usuario';
import { RutaPage } from '../pages/ruta/ruta';
import { AgendaPage } from '../pages/agenda/agenda';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CalendarModule } from "ion2-calendar";
import { ProveedorProvider } from '../providers/proveedor/proveedor';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { UsuarioProvider } from '../providers/usuario/usuario';







var firebaseConfig = {
  apiKey: "AIzaSyAP_WEwEHzcsTy5aeIDZ0cc_UjcHZGzFuU",
  authDomain: "adrenalina-1207.firebaseapp.com",
  databaseURL: "https://adrenalina-1207.firebaseio.com",
  projectId: "adrenalina-1207",
  storageBucket: "adrenalina-1207.appspot.com",
  messagingSenderId: "794626592183"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    NuevoUsuarioPage,
    PerfilUsuarioPage,
    RutaPage,
    AgendaPage 
  ],
  imports: [
    BrowserModule, 
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    
    

    IonicModule.forRoot(MyApp),
    CalendarModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    NuevoUsuarioPage,
    PerfilUsuarioPage,
    RutaPage,
    AgendaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsuarioProvider,
    ProveedorProvider

  ]
})
export class AppModule {}
