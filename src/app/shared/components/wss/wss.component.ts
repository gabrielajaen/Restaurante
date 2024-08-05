import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wss',
  templateUrl: './wss.component.html',
  styleUrls: ['./wss.component.scss'],
})
export class WssComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  openWhatsApp() {
    const phoneNumber = '593995947034'; // Reemplaza con el número de teléfono
    const message = 'Hola%20quiero%20más%20información'; // Reemplaza con el mensaje codificado en URL
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  }

}
