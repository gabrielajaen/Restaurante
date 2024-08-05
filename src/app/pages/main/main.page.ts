import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MenuController, } from '@ionic/angular';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  pages = [
   // { title: 'Inicio', url: '/main/home', icon: 'home' },
    { title: 'Perfil', url: '/main/perfil', icon: 'person' },
    { title: 'Facturación', url: '/main/facturacion', icon: 'document-outline' },
    { title: 'Productos', url: '/main/homeadmin', icon: 'fast-food-outline' },
    { title: 'Estadistica', url: '/main/estadistica', icon: 'fast-food-outline' },
   
    

  ];

  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  private menuCtrl = inject(MenuController);
  
  currentpath: string = '';
  userImage$: Observable<string> = of('');
  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentpath = event.url;
    });

    this.userImage$ = this.firebaseSvc.getCurrentUser().pipe(
      switchMap(user => user.uid ? this.firebaseSvc.getUserProfileImage(user.uid) : of(''))
    );
  }
  user(): User{
    return this.utilSvc.getFromLocalStorage('user');
  }
  

  cerrarsesion(){
    this.firebaseSvc.salir();  
   this.router.navigateByUrl('/home'); 
  }
  
  async handleMenuItemClick(url: string) {
    if (url === '/home') {
      await this.firebaseSvc.salir();   
      this.utilSvc.removeFromLocalStorage('user');
    }

    // Navega a la página correspondiente
    await this.router.navigateByUrl(url);
  
    // Cierra el menú
    const menu = await this.menuCtrl.getOpen();
    if (menu) {
      menu.close();
    }
  }

}
