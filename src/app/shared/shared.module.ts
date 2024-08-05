import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InsertarProductoComponent } from './components/insertar-producto/insertar-producto.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BuscarComponent } from './components/buscar/buscar.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { PlatosComponent } from './components/platos/platos.component';
import { ButtonComponent } from './components/button/button.component';
import { CarritoItemsComponent } from './components/carrito-items/carrito-items.component';
import { InvoiceDetailComponent } from './components/invoice-detail/invoice-detail.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { EditperfilComponent } from './components/editperfil/editperfil.component';
import { WssComponent } from './components/wss/wss.component';
@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    InsertarProductoComponent,
    BuscarComponent,
    CategoriasComponent, 
    PlatosComponent,
    ButtonComponent,
    CarritoItemsComponent,
    InvoiceDetailComponent, 
    TerminosComponent,
    EditperfilComponent,
    WssComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    InsertarProductoComponent, 
    BuscarComponent,
    CategoriasComponent,
    PlatosComponent,
    CarritoItemsComponent,
    ButtonComponent,
    InvoiceDetailComponent,
    TerminosComponent,
    EditperfilComponent,
    WssComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
