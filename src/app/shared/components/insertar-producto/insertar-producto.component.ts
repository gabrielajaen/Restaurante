import { Component, OnInit, Inject, Input, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Platos } from 'src/app/models/platos.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-insertar-producto',
  templateUrl: './insertar-producto.component.html',
  styleUrls: ['./insertar-producto.component.scss'],
})
export class InsertarProductoComponent implements OnInit {
  @Input() product: Platos;
  categorias: string[] = ['Fast food', 'Ecuatoriana', 'Asados']; // Lista de categorías

  form = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
    imagen: new FormControl('', [Validators.required]),
    detalle: new FormControl('', [Validators.required]),
    precio: new FormControl(null, [Validators.required, Validators.min(0)]),
    categoria: new FormControl('', [Validators.required]),
  });

  user: User;

    firebaseSvc= inject(FirebaseService);
    utilsSvc = inject(UtilsService)
 

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product) {
      this.form.patchValue(this.product);
      console.log('ID del documento a actualizar:', this.product?.id); // Usar navegación segura (?.)
    }
  }
  
  

  async submit() {
    if (this.form.valid) {
      if (this.product) {
        await this.actualizarPlato();
      } else {
        await this.crearPlato();
      }
    }
  }
  

  // Tomar o seleccionar Imagen
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del plato')).dataUrl;
    this.form.controls.imagen.setValue(dataUrl);
  }

  // Crear Plato
  async crearPlato() {
    const path = `users/${this.user.uid}/products`;
    
    const loading = await this.utilsSvc.loading();
    try {
      let dataUrl = this.form.value.imagen;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.subirImagen(imagePath, dataUrl);
      this.form.controls.imagen.setValue(imageUrl);
      delete this.form.value.id; // Eliminar el campo 'id'

      await this.firebaseSvc.addDocument(path, this.form.value);
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Plato creado correctamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error('Error al crear el plato:', error);
    } finally {
      loading.dismiss();
    }
  }

  // Actualizar Plato
  async actualizarPlato() {
    const path = `users/${this.user.uid}/products/${this.product.id}`;
  
    const loading = await this.utilsSvc.loading();
    try {
      // Actualizar la imagen si ha cambiado
      if (this.form.value.imagen !== this.product.imagen) {
        const dataUrl = this.form.value.imagen;
        const imagePath = await this.firebaseSvc.getFilePath(this.product.imagen);
        const imageUrl = await this.firebaseSvc.subirImagen(imagePath, dataUrl);
        this.form.controls.imagen.setValue(imageUrl);
      }
  
      // Eliminar el campo 'id' del formulario antes de actualizar
      delete this.form.value.id;
  
      // Actualizar solo los campos modificados
      await this.firebaseSvc.updateDocument(path, this.form.value);
  
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Plato actualizado correctamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error('Error al actualizar el plato:', error);
    } finally {
      loading.dismiss();
    }
  }
  
  
  
}
