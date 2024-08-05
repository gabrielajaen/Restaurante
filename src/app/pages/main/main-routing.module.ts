import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'homeadmin',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('./perfil/perfil.module').then((m) => m.PerfilPageModule),
      },
      {
        path: 'facturacion',
        loadChildren: () => import('./facturacion/facturacion.module').then( m => m.FacturacionPageModule)
      },
      
      {
        path: 'estadistica',
        loadChildren: () => import('./estadistica/estadistica.module').then( m => m.EstadisticaPageModule)
      },

    ],
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
 

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
