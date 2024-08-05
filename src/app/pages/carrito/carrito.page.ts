import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { Carrito} from 'src/app/models/carrito.model'
import { CarritoService } from 'src/app/services/carrito.service';
import { HttpClient } from '@angular/common/http'; 

import { catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
carItems$: Observable<any[]>;
totalFin$: Observable<number>;

private carritoCollection = 'users';
  constructor(private cartSrv: CarritoService,   private http: HttpClient) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadData();
  }

  loadData() {
    this.carItems$ = this.cartSrv.getCarrito();
    this.totalFin$ = this.cartSrv.getTotalAmount();

    this.carItems$.subscribe(items => {
      console.log('Carrito items:', items);
    });
  }

  onIncrease(item: Carrito) {
    const newQuantity = item.cantidad + 1;
    this.cartSrv.updateCantidad(item.id, newQuantity);
  }

 onDecrease(item: Carrito) {
  const newQuantity = item.cantidad - 1;
  if (newQuantity >= 1) { // Asegúrate de que la cantidad no sea negativa
    this.cartSrv.updateCantidad(item.id, newQuantity);
  }
}

  removeCarrito(item: any) {
    this.cartSrv.removeCarrito(item.id);
  }

  
  realizarPago() {
    this.totalFin$.subscribe(total => {
      const amount = total.toFixed(2);
      this.http.post<{ url: string }>('http://localhost:3000/createPayment', { amount })
        .subscribe(
          (response) => {
            if (response && response.url) {
              window.location.href = response.url;
            } else {
              console.error('No URL in response');
            }
          },
          (error) => {
            console.error('Error during payment creation:', error);
          }
        );
    });
  }
  
  
  

}


