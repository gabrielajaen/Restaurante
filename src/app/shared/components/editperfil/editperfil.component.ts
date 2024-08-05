import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth, User } from 'firebase/auth';
import { UtilsService } from 'src/app/services/utils.service';
import { Observable, of, switchMap } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-editperfil',
  templateUrl: './editperfil.component.html',
  styleUrls: ['./editperfil.component.scss'],
})
export class EditperfilComponent implements OnInit {
  user: any = {}; 
  imageDataUrl: string = '';
  currentPassword: string = '';
  newPassword: string = '';

  firebaseSvc= inject(FirebaseService);
  utilSvc = inject(UtilsService)
  userImage$: Observable<string> = of('');
  constructor(private modalController: ModalController, private firebaseService: FirebaseService, private toastController: ToastController) {
    this.loadUserData();
    this.userImage$ = this.firebaseSvc.getCurrentUser().pipe(
      switchMap(user => user.uid ? this.firebaseSvc.getUserProfileImage(user.uid) : of(''))
    );
  }

  ngOnInit() {
    this.firebaseSvc.getCurrentUser().subscribe(userData => {
      this.user = userData;
      if (userData.uid) {
        this.userImage$ = this.firebaseSvc.getUserProfileImage(userData.uid);
      }
    });
  }
  

  async dismiss() {
    await this.modalController.dismiss();
  }

  async loadUserData() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      this.user = await this.firebaseService.getDocument(`users/${user.uid}`);
    }
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Duración del toast en milisegundos
      color: color,    // Color del toast
      position: 'middle'  // Posición en la pantalla
    });
    await toast.present();
  }
  
  async updateProfile() {
    if (this.currentPassword && this.newPassword) {
      try {
        // Reautenticación del usuario
        await this.firebaseService.reauthenticateUser(this.user.email, this.currentPassword);
  
        // Cambio de la contraseña
        await this.firebaseService.changePassword(this.newPassword);
  
        // Actualización del nombre de usuario
        if (this.user.nombre) {
          const userPath = `users/${this.user.uid}`;
          await this.firebaseService.updateDocument(userPath, { nombre: this.user.nombre });
        }
  
        await this.presentToast('Perfil actualizado con éxito');
        this.currentPassword = '';
        this.newPassword = '';
        this.dismiss();
      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        await this.presentToast('Error al actualizar el perfil: ' + error.message, 'danger');
      }
    } else if (this.user.nombre) {
      try {
        // Solo actualizar el nombre si no se cambió la contraseña
        const userPath = `users/${this.user.uid}`;
        await this.firebaseService.updateDocument(userPath, { nombre: this.user.nombre });
        await this.presentToast('Nombre actualizado con éxito');
        this.dismiss();
      } catch (error) {
        console.error('Error al actualizar el nombre:', error);
        await this.presentToast('Error al actualizar el nombre: ' + error.message, 'danger');
      }
    } else {
      await this.presentToast('Por favor ingrese la contraseña actual y la nueva, o el nombre de usuario.', 'warning');
    }
  }
  

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imageDataUrl = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  async takeImage() {
    const auth = getAuth();
    const userAuth = auth.currentUser;
  
    if (userAuth) {
      const userPath = `users/${userAuth.uid}`;
      
      const loading = await this.utilSvc.loading();
      
      try {
        const { dataUrl } = await this.utilSvc.takePicture('Imagen del perfil');
        
        const imagePath = `${userAuth.uid}/perfil`;
        const imageUrl = await this.firebaseSvc.subirImagen(imagePath, dataUrl);
  
        // Actualiza el objeto user local y en la base de datos
        this.user.imagen = imageUrl;
        await this.firebaseSvc.updateDocument(userPath, { imagen: imageUrl });
  
        this.utilSvc.saveInLocalStorage('user', this.user);
  
        await this.presentToast('Imagen cambiada con éxito');
      } catch (error) {
        console.error('Error al actualizar imagen:', error);
      } finally {
        loading.dismiss();
        
      }
    } else {
      console.error('No hay usuario autenticado.');
    }
  }
  
  
}
