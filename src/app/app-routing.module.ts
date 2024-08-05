import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { TerminosComponent } from './shared/components/terminos/terminos.component';
import { EditperfilComponent } from './shared/components/editperfil/editperfil.component';

const routes: Routes = [
  { path: 'terminos', component: TerminosComponent },
  { path: 'editarperfil', component: EditperfilComponent },
  {
    //Donde quiero que inicie
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule), canActivate:[NoAuthGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule),canActivate:[AuthGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/main/usuarios/usuarios.module').then( m => m.UsuariosPageModule),canActivate:[AuthGuard]
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/productos/productos.module').then( m => m.InPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'detalle/:id',
    loadChildren: () => import('./pages/detalle/detalle.module').then( m => m.DetallePageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'pagoexito',
    loadChildren: () => import('./pages/pagoexito/pagoexito.module').then( m => m.PagoexitoPageModule)
  },
  {
    path: 'perfiluser',
    loadChildren: () => import('./pages/perfiluser/perfiluser.module').then( m => m.PerfiluserPageModule)
  },
  {
    path: 'estadistica',
    loadChildren: () => import('./pages/main/estadistica/estadistica.module').then( m => m.EstadisticaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
