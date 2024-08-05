import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfiluserPage } from './perfiluser.page';

const routes: Routes = [
  {
    path: '',
    component: PerfiluserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfiluserPageRoutingModule {}
