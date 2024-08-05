import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  async generatePdf(user: any, carItems: any[], total: number) {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    // Título del documento
    const spaceAfterImage = 10;
    const titleYPosition = 10 + 30 + spaceAfterImage;
    doc.setTextColor(2, 5, 7);
    doc.setFontSize(40);
    doc.setFont('Courier', 'bold');
    const title = 'Factura';
    const textWidth = doc.getTextWidth(title);
    const titleXOffset = (pageWidth - textWidth) / 2;
    doc.text(title, titleXOffset, titleYPosition);

    // Imagen
    const imgUrl = 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSsxbvK5bAiGjxh7-SucMOsZwgbXsQ2QhK3Vai91hTMI6VoDWzL';
    const imgData = await this.getBase64Image(imgUrl);
    const imgWidth = 50; // Ancho de la imagen en el PDF
    const imgHeight = 30; // Altura de la imagen en el PDF
    const xOffset = (pageWidth - imgWidth) / 2;
    doc.addImage(imgData, 'JPEG', xOffset, 10, imgWidth, imgHeight);

    // Información del usuario
    const userName = user.displayName || 'Nombre no disponible';
    const userEmail = user.email || 'Email no disponible';
    const userInfoYPosition = titleYPosition + 30;
    doc.setFontSize(15);
    doc.setFont('Helvetica', 'italic');
    doc.text(`Usuario: ${userName}`, 20, userInfoYPosition);
    doc.text(`Email: ${userEmail}`, 20, userInfoYPosition + 10);

    // Tabla de productos comprados
    const tableStartY = userInfoYPosition + 30;
    (doc as any).autoTable({
      headStyles: { fillColor: [255, 183, 39], fontSize: 15 },
      bodyStyles: { fillColor: [255, 255, 255], fontSize: 15 },
      head: [['Producto', 'Cantidad', 'Precio']],
      body: carItems.map(item => [item.nombre, item.cantidad, `$${item.precio}`]),
      startY: tableStartY
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || tableStartY;
    doc.setTextColor(255, 0, 0);
    doc.setFontSize(15);
    const totalText = `Total: $${total.toFixed(2)}`;
    const totalTextWidth = doc.getTextWidth(totalText);
    const totalXOffset = pageWidth - totalTextWidth - 10;
    doc.text(totalText, totalXOffset, finalY + 10);

    // Guardar el documento
    doc.save('factura.pdf');
  }

  private async getBase64Image(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = img.height;
        canvas.width = img.width;
        context.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = (error) => reject(error);
    });
  }
}
