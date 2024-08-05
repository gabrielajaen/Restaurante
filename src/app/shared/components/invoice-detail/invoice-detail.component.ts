import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
})
export class InvoiceDetailComponent  implements OnInit {
  @Input() invoice: any;
  invoiceData: any[] = []; 
  users: { [key: string]: string } = {};
  constructor(private modalController: ModalController) { }
  dismiss() {
    this.modalController.dismiss();
  }
  ngOnInit() {
    this.loadUsersAndInvoices();
  }

  async loadUsersAndInvoices() {
    const firestore = getFirestore();
    
    // Load users
    const usersRef = collection(firestore, 'users');
    const usersSnapshot = await getDocs(usersRef);
    this.users = usersSnapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[doc.id] = data['nombre'];
      return acc;
    }, {});

    // Load invoices
    const invoiceRef = collection(firestore, 'facturacion');
    const invoiceSnapshot = await getDocs(invoiceRef);
    this.invoiceData = invoiceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  getUserName(userId: string): string {
    return this.users[userId] || 'Unknown User'; // Return 'Unknown User' if not found
  }
}
