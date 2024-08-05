import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Carrito } from 'src/app/models/carrito.model';
import { Platos } from 'src/app/models/platos.model';
import { PlatosService } from 'src/app/services/food.service';
import { CarritoService } from '../../services/carrito.service';
import { ToastController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  id: string;
  plato: Platos = {
    id: '',
    nombre: '',
    precio: 0,
    imagen: '',  // Inicializa con valores por defecto si es posible
    detalle: '',
    categoria: '',
  };
  isAuthenticated: boolean = false;
  adminEmail = 'gabriela.jaen10@gmail.com';
  error: string;

  constructor(private activateRoute: ActivatedRoute, private platosSvr: PlatosService, private carSrv: CarritoService, private toastCtrl: ToastController, private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService) { 
    this.id = this.activateRoute.snapshot.paramMap.get('id')
    
  }

    ngOnInit() {
    //const numericId = parseInt(this.id, 10);
    this.id = this.activateRoute.snapshot.paramMap.get('id');
  console.log('ID obtenido del route:', this.id);

  this.firebaseSvc.getauth().onAuthStateChanged((auth) => {
    this.isAuthenticated = !!auth;
    this.loadPlato();

  });

  }

  loadPlato() {
    console.log('Iniciando carga de plato...');
    this.firebaseSvc.getUserByEmail(this.adminEmail).subscribe(users => {
      console.log('Usuarios obtenidos:', users);
      if (users.length > 0) {
        const user = users[0];
        const uid = user.id;
        console.log('UID del usuario:', uid);
  
        this.firebaseSvc.getDishById(uid, this.id).subscribe(plato => {
          console.log('Plato obtenido:', plato);
          if (plato) {
            this.plato = plato;
          } else {
            console.error('No se encontró el plato con el id:', this.id);
          }
        }, error => {
          this.error = 'Error al obtener el plato';
          console.error('Error al obtener el plato:', error);
        });
      } else {
        console.error('No se encontró el usuario con el email:', this.adminEmail);
      }
    }, error => {
      this.error = 'Error al obtener el usuario';
      console.error('Error al obtener el usuario:', error);
    });
  }
  
  
  


  async addCarrito() {
    if (this.isAuthenticated) {
      const user = this.firebaseSvc.getauth().currentUser;
  
      if (user) {
        const carritoItem: Carrito = {
          id: this.plato.id,
          nombre: this.plato.nombre,
          precio: this.plato.precio,
          image: this.plato.imagen,
          categoria: this.plato.categoria,
          cantidad: 1,
        };
  
        try {
          await this.firebaseSvc.addToCart(user.uid, carritoItem);
          this.presentToast('Plato agregado al carrito', 'success');
        } catch (error) {
          this.presentToast('Error al agregar el plato al carrito', 'danger');
        }
      } else {
        this.presentToast('Usuario no autenticado', 'danger');
      }
    } else {
      this.presentToast('Por favor, inicia sesión para añadir productos al carrito.', 'danger');
    }
  }
  

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      mode: 'ios',
      duration: 1000,
      color,
      position: 'top',
      // icon: 'cart-outline'
    });
    toast.present();
  }
}
