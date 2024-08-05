import { Component, OnInit, Inject, Input, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, of, switchMap } from 'rxjs';
import { Platos } from 'src/app/models/platos.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EditperfilComponent } from 'src/app/shared/components/editperfil/editperfil.component';
import { TerminosComponent } from 'src/app/shared/components/terminos/terminos.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
 firebaseSvc= inject(FirebaseService);
  utilSvc = inject(UtilsService)
  userImage$: Observable<string> = of('');
  constructor(private router: Router, private modalController: ModalController){}
  ngOnInit() {
    this.userImage$ = this.firebaseSvc.getCurrentUser().pipe(
      switchMap(user => user.uid ? this.firebaseSvc.getUserProfileImage(user.uid) : of(''))
    );
  }


  user(): User{
    return this.utilSvc.getFromLocalStorage('user');
  }

  async takeImage() {

    let user = this.user();
    const path = `users/${user.uid}`;
  
    const loading = await this.utilSvc.loading();
    
    try {
    const dataUrl = (await this.utilSvc.takePicture('Imagen del perfil')).dataUrl;
   
    let imagePath = `${user.uid}/perfil`;
    user.imagen = await this.firebaseSvc.subirImagen(imagePath, dataUrl);
    this.firebaseSvc.updateDocument(path, {imagen: user.imagen});
  
    this.utilSvc.saveInLocalStorage('user', user);

    this.utilSvc.presentToast({
      message: 'Imagen actualizado correctamente',
      duration: 1500,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline',
    });
  } catch (error) {
    console.error('Error al actualizar imagen:', error);
  } finally {
    loading.dismiss();
  }
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
