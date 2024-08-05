import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

    firebaseSvc = inject(FirebaseService);
  ngOnInit() {
  }

  cerrarsesion(){
    this.firebaseSvc.salir();  }

}
