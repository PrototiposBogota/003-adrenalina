import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NuevoUsuarioPage } from './nuevo-usuario';

@NgModule({
  declarations: [
    NuevoUsuarioPage,
  ],
  imports: [
    IonicPageModule.forChild(NuevoUsuarioPage),
  ],
})
export class NuevoUsuarioPageModule {}
