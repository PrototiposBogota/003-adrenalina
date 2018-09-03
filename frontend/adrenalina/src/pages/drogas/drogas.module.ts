import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrogasPage } from './drogas';

@NgModule({
  declarations: [
    DrogasPage,
  ],
  imports: [
    IonicPageModule.forChild(DrogasPage),
  ],
})
export class DrogasPageModule {}
