import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductosPage } from '../productos/productos.page';
import { ProductosPageRoutingModule } from '../productos/productos-routing.module';
import { SharedModule } from "../../shared/shared.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductosPageRoutingModule,
    SharedModule
],
  declarations: [ProductosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InPageModule {}
