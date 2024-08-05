
import { Injectable } from "@angular/core";
import { Carrito } from "../models/carrito.model";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, increment, updateDoc, writeBatch } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})

export class CarritoService{
    //private item$ = new BehaviorSubject<Carrito[]>([]);
    private carritoCollection = 'users';
    private user = new BehaviorSubject<any>(null);
    constructor(private firestore: AngularFirestore) {
      const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user.next(user);
      } else {
        this.user.next(null);
      }
    });
    }
    
  //firebase
  getCarrito(): Observable<Carrito[]> {
    return this.user.pipe(
      map(user => {
        if (user) {
          const carritoRef = this.firestore.collection<Carrito>(`${this.carritoCollection}/${user.uid}/carrito`);
          return carritoRef.valueChanges({ idField: 'id' });
        } else {
          return of([]);
        }
      }),
      switchMap(carrito$ => carrito$)
    );
  }

 // Obtener el total del carrito
 getTotalAmount(): Observable<number> {
  return this.getCarrito().pipe(
    map(items => items.reduce((total, item) => total + item.precio * item.cantidad, 0))
  );
}


Total(change: number, itemId: string) {
  const user = getAuth().currentUser;
  if (user) {
    const itemRef = doc(this.firestore.firestore, `${this.carritoCollection}/${user.uid}/carrito/${itemId}`);
    updateDoc(itemRef, {
      cantidad: increment(change)
    }).catch(error => {
      console.error('Error al actualizar la cantidad: ', error);
    });
  }
}

async updateCantidad(productId: string, cantidad: number) {
  const user = getAuth().currentUser;
  if (user) {
    const itemRef = doc(this.firestore.firestore, `${this.carritoCollection}/${user.uid}/carrito/${productId}`);
    await updateDoc(itemRef, { cantidad }).catch(error => {
      console.error('Error al actualizar la cantidad: ', error);
    });
  }
}

async changeCantidad(change: number, itemId: string) {
  const user = getAuth().currentUser;
  if (user) {
    const itemRef = doc(this.firestore.firestore, `${this.carritoCollection}/${user.uid}/carrito/${itemId}`);
    await updateDoc(itemRef, {
      cantidad: increment(change)
    }).catch(error => {
      console.error('Error al actualizar la cantidad: ', error);
    });
  }
}


async removeCarrito(itemId: string) {
  const user = getAuth().currentUser;
  if (user) {
    const itemRef = doc(this.firestore.firestore, `${this.carritoCollection}/${user.uid}/carrito/${itemId}`);
    await deleteDoc(itemRef).catch(error => {
      console.error('Error al eliminar el producto: ', error);
    });
  }
}


}


