import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { InvoiceDetailComponent } from 'src/app/shared/components/invoice-detail/invoice-detail.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.page.html',
  styleUrls: ['./facturacion.page.scss'],
})
export class FacturacionPage implements OnInit {
  user: any;
  invoiceData: any[] = []; 
  users: { [key: string]: string } = {};
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.loadUsersAndInvoices();
  }

  async loadUsersAndInvoices() {
    const firestore = getFirestore();
  
    // Obtener usuarios
    const usersRef = collection(firestore, 'users');
    const usersSnapshot = await getDocs(usersRef);
    this.users = usersSnapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[doc.id] = data['nombre'];
      return acc;
    }, {});
  
    // Obtener facturas
    const invoiceRef = collection(firestore, 'facturacion');
    const invoiceSnapshot = await getDocs(invoiceRef);
    
    // Convertir los datos y manejar diferentes formatos de fecha
    this.invoiceData = invoiceSnapshot.docs.map(doc => {
      const data = doc.data();
      let date;
  
      // Verificar el tipo de dato de `date`
      if (data['date'] && typeof data['date'].toDate === 'function') {
        // Si es un Timestamp
        date = data['date'].toDate();
      } else if (data['date'] instanceof Date) {
        // Si ya es un objeto Date
        date = data['date'];
      } else {
        // Si es un string, intentar convertirlo
        date = new Date(data['date']);
      }
  
      return {
        id: doc.id,
        userId: data['userId'],
        totalAmount: data['totalAmount'],
        date: date,
        products: data['products'] || [] // Asegúrate de que este campo esté presente
      };
    });
  
    // Ordenar las facturas por fecha (más reciente primero)
    this.invoiceData.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  
  
  getUserName(userId: string): string {
    return this.users[userId] || 'Unknown User'; // Return 'Unknown User' if not found
  }

  async openInvoiceDetail(invoice: any) {
    const modal = await this.modalController.create({
      component: InvoiceDetailComponent,
      componentProps: {
        invoice: invoice
      }
    });
    return await modal.present();
  }
}