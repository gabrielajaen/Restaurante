import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagoexitoPageRoutingModule } from './pagoexito-routing.module';

import { PagoexitoPage } from './pagoexito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagoexitoPageRoutingModule
  ],
  declarations: [PagoexitoPage]
})
export class PagoexitoPageModule {}
