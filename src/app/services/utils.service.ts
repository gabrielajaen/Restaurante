import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType , CameraSource} from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtr = inject(ModalController);
  router = inject(Router);
  alertCtrl= inject(AlertController);


  
  async takePicture(promptLabelHeader: string){
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Seleccione una imagen',
      promptLabelPicture: 'Tome una foto'
    });
  
  }
  
  //Alerta para eliminar producto
  async presentAlert(opts?: AlertOptions){
    const alert = await this.alertCtrl.create(opts);
  
    await alert.present();
  }

  loading(){
    return this.loadingCtrl.create({spinner:'crescent'})
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //Enruta a cualquer pagina disponible
  routerLink(url : string){
    return this.router.navigateByUrl(url);
  }

  //Guarda en local storage
  saveInLocalStorage(key:string, value:any){
    return localStorage.setItem(key, JSON.stringify(value))
  }

  //Obtiene del LocalStorage
  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key))
  }



  removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
  //Modal
  async presentModal(opts : ModalOptions) {
    const modal = await this.modalCtr.create(opts);
   await modal.present();

   const {data} = await modal.onWillDismiss()
   if(data) return data;
  }


  dismissModal(data?: any){
    return this.modalCtr.dismiss(data);
  }
}