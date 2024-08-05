import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadisticaPageRoutingModule } from './estadistica-routing.module';

import { EstadisticaPage } from './estadistica.page';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadisticaPageRoutingModule,
    NgApexchartsModule
  ],
  declarations: [EstadisticaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EstadisticaPageModule {}
