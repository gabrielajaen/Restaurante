import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, of, switchMap } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { EditperfilComponent } from 'src/app/shared/components/editperfil/editperfil.component';
import { TerminosComponent } from 'src/app/shared/components/terminos/terminos.component';

@Component({
  selector: 'app-perfiluser',
  templateUrl: './perfiluser.page.html',
  styleUrls: ['./perfiluser.page.scss'],
})
export class PerfiluserPage implements OnInit {
  user: any = {}; 
  firebaseSvc= inject(FirebaseService);
    userImage$: Observable<string> = of('');
  constructor(private modalController: ModalController) {
    
  }

  ngOnInit() {
    
  }

  async openTerminos() {
    const modal = await this.modalController.create({
      component: TerminosComponent,
     // cssClass: 'app-terminos-' // Si tienes clases CSS personalizadas
    });
    return await modal.present();
  }
  async openPerfil() {
    const modal = await this.modalController.create({
      component: EditperfilComponent,
     // cssClass: 'app-terminos-' // Si tienes clases CSS personalizadas
    });
    return await modal.present();
  }
}
