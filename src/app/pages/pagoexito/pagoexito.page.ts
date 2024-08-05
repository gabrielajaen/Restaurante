import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, writeBatch } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { CarritoService } from 'src/app/services/carrito.service';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-pagoexito',
  templateUrl: './pagoexito.page.html',
  styleUrls: ['./pagoexito.page.scss'],
})
export class PagoexitoPage implements OnInit {
  paymentId: string;
  isAuthenticated: boolean = false;
  user: any;
  carItems$: Observable<any[]>;
  totalFin$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartSrv: CarritoService,
    private pdfService: PdfService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['paymentId'];
      if (this.paymentId) {
        this.checkAuthAndClearCart();
      }
    });
  }

  async checkAuthAndClearCart() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.isAuthenticated = true;
        this.user = user;
        await this.clearCart(); // Llama a clearCart solo si el usuario está autenticado
        this.generateAndDownloadPdf(); // Llama aquí después de limpiar el carrito
      } else {
        this.isAuthenticated = false;
        console.error('No authenticated user found');
      }
    });
  }

  loadData() {
    this.carItems$ = this.cartSrv.getCarrito();
    this.totalFin$ = this.cartSrv.getTotalAmount();
  }

  generateAndDownloadPdf() {
    this.carItems$.subscribe(carItems => {
      this.totalFin$.subscribe(total => {
        if (this.user) {
          this.pdfService.generatePdf(this.user, carItems, total);
        } else {
          console.error('No user information available');
        }
      });
    });
  }

  async clearCart() {
    if (this.isAuthenticated && this.user) {
      console.log('Clearing cart...');
      const firestore = getFirestore();
      const carritoRef = collection(firestore, `users/${this.user.uid}/carrito`);
      const snapshot = await getDocs(carritoRef);
      const batch = writeBatch(firestore);
      let totalAmount = 0;
      let products = [];

      if (snapshot.empty) {
        console.log('No items found in cart.');
      } else {
        snapshot.docs.forEach(doc => {
          console.log('Deleting document:', doc.id);
          products.push(doc.data()); // Guardar datos del producto
          totalAmount += doc.data()['precio'] * doc.data()['cantidad']; // Calcular el total
          batch.delete(doc.ref);
        });

        try {
          await batch.commit();
          console.log('Carrito eliminado con éxito');
          await this.createInvoice(totalAmount, products); // Crear factura
        } catch (error) {
          console.error('Error al eliminar el carrito:', error);
        }
      }

      this.router.navigate(['/home']);
    } else {
      console.error('No authenticated user found or user object is undefined');
    }
  }

  async createInvoice(totalAmount: number, products: any[]) {
    const firestore = getFirestore();
    const invoiceData = {
      userId: this.user.uid,
      products: products,
      totalAmount: totalAmount,
      date: new Date().toISOString()
    };

    try {
      const invoiceRef = collection(firestore, 'facturacion');
      await addDoc(invoiceRef, invoiceData);
      console.log('Factura creada con éxito');
    } catch (error) {
      console.error('Error al crear la factura:', error);
    }
  }
}
