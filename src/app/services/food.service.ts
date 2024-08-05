import { inject, Injectable } from "@angular/core";
import { Platos } from "../models/platos.model";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PlatosService {

  router = inject(Router);
  getFoods(): Platos[] {
    return [
      {
        imagen:
          'https://img.freepik.com/vector-premium/ilustracion-comida-chatarra-dibujos-animados-lindo_403370-23.jpg',
        nombre: 'Plato 1',
        detalle: 'Delicioso',
        precio: 15,
        categoria: 'ecuatoriana',
        id: '20',
      }
    ];
  }

  getFood(id: number): Platos {
    return this.getFoods().find((food) => food.id === id.toString());
  }
}