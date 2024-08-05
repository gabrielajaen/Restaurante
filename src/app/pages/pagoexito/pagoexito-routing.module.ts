import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoexitoPage } from './pagoexito.page';

const routes: Routes = [
  {
    path: '',
    component: PagoexitoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagoexitoPageRoutingModule {}
