import { Component, OnInit, inject } from '@angular/core';
import { User } from 'firebase/auth';
import { Platos } from 'src/app/models/platos.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { InsertarProductoComponent } from 'src/app/shared/components/insertar-producto/insertar-producto.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  products: Platos[] = [];
  loading: boolean = false;
  ngOnInit() {}

  //Cerrar Sesion
  salir() {
    this.firebaseSvc.salir();
    this.utilSvc.routerLink('/home');
  }


  user(): User{
    return this.utilSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProductos();
  }
  //OBTENER PRODUCTOS
  getProductos() {
    let path = `users/${this.user().uid}/products`;
    this.loading = true;
    let sub = this.firebaseSvc.obtenerDatos(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        this.loading = false;
        sub.unsubscribe();
      }
    })
  }
  
  //Agregar Actualizar Producto
  async addUpdateProducto(product?: Platos) {
  let success= await  this.utilSvc.presentModal({
      component: InsertarProductoComponent,
      cssClass: 'add-uppdate-moda',
      componentProps: {product}
    })
    if(success) this.getProductos();
  }

  async confirmDeleteProduct(product: Platos) {
    this.utilSvc.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Quieres eliminar este producto?',
      mode:'ios',
      buttons: [
        {
          text: 'Cancelar',
          
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.eliminarPlato(product)
          }
        }
      ]
    });
  
  }

  //Eliminar Producto
  async eliminarPlato(product: Platos) {
    const path = `users/${this.user().uid}/products/${product.id}`;
  
    const loading = await this.utilSvc.loading();
    await loading.present();

    const imagePath = await this.firebaseSvc.getFilePath(product.imagen);
    await this.firebaseSvc.deletefile(imagePath);

      this.firebaseSvc.deleteDocument(path).then(async res => {
        this.products = this.products.filter(p => p.id !== product.id);

        this.utilSvc.presentToast({
          message: 'Plato eliminadocorrectamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        })
      }).catch (error =>{
        console.log(error);
        this.utilSvc.presentToast({
          message: error.message,
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        })
      }).finally (() => {
        loading.dismiss();
      }
  )}


}
