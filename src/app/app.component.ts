import { Component, inject, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { MenuController, } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import { UtilsService } from './services/utils.service';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  isAuthenticated: boolean = false;
  private firebaseSvc = inject(FirebaseService);
  private utilSvc = inject(UtilsService);
  
  private menuCtrl = inject(MenuController);
  private router = inject(Router);
  constructor() {}

  async handleMenuItemClick(url: string) {
    // Navega a la página correspondiente
    await this.router.navigateByUrl(url);

    // Cierra el menú
    const menu = await this.menuCtrl.getOpen();
    if (menu) {
      menu.close();
    }
  }

  ngOnInit() {
    this.firebaseSvc.getauth().onAuthStateChanged((auth) => {
      this.isAuthenticated = !!auth;
      if (auth) {
        this.utilSvc.saveInLocalStorage('user', auth);
      } else {
        this.utilSvc.removeFromLocalStorage('user');
      }
    });
  }
  
  async handleSignOut() {
    await this.firebaseSvc.salir();
    this.isAuthenticated = false;
    this.utilSvc.removeFromLocalStorage('user');
    await this.router.navigateByUrl('/auth');
    this.closeMenu();
  }

  closeMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      menu.close();
    }
  }

}
