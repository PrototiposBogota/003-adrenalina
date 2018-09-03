import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { NuevoUsuarioPage } from '../pages/nuevo-usuario/nuevo-usuario';
import { PerfilUsuarioPage } from '../pages/perfil-usuario/perfil-usuario';
import { RutaPage } from '../pages/ruta/ruta';
import { AgendaPage } from '../pages/agenda/agenda';
import { DenunciaPage } from '../pages/denuncia/denuncia';
import { DrogasPage } from '../pages/drogas/drogas';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Login', component: LoginPage },
      { title: 'Nuevo Usuario', component: NuevoUsuarioPage },
      { title: 'Perfil de Usuario', component: PerfilUsuarioPage },
      { title: 'Ruta de Acción', component: RutaPage },
      { title: 'Info De Sustancias', component: DrogasPage },
      { title: 'Denuncia', component: DenunciaPage },
      { title: 'Calendario Actividades', component: AgendaPage},
      { title: 'Chatea con Nosotros', component: RutaPage },
      { title: 'Programas de apoyo', component: RutaPage },

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
