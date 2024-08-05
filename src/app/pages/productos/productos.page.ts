import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria.model';
import { Platos } from 'src/app/models/platos.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PlatosService } from 'src/app/services/food.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-in',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  isAuthenticated: boolean = false;
  categorias: Categoria[] = [];
  platos: Platos[] =[];
  user: any;
  adminEmail = 'gabriela.jaen10@gmail.com';
  filteredPlatos: Platos[] = [];
  selectedCategory: string = 'All';
slideOpts: any;
  constructor(private platosServ: PlatosService, private router: Router,  private utilSvc: UtilsService, private firebaseSvc: FirebaseService) {}

  ngOnInit() {
    this.getCategorias();
    //this.platos =this.platosServ.getFoods();
    this.firebaseSvc.getauth().onAuthStateChanged((auth) => {
      this.isAuthenticated = !!auth;
      if (auth) {
        this.firebaseSvc.getUserByEmail(auth.email).subscribe(users => {
          if (users.length > 0) {
            this.user = users[0];
          }
        });
      }
      this.loadPlatos();
    });
  }

  buscarProductos(term: string) {
    const searchTerm = term.toLowerCase();
    if (searchTerm && searchTerm.trim() !== '') {
      this.filteredPlatos = this.platos.filter((plato) =>
        plato.nombre.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredPlatos = [...this.platos];
    }
  }

  loadPlatos() {
    this.firebaseSvc.getUserByEmail(this.adminEmail).subscribe(users => {
      if (users.length > 0) {
        const user = users[0];  // Assuming email is unique
        const uid = user.id;
        this.firebaseSvc.getDishesByUserId(uid).subscribe(dishes => {
          this.platos = dishes;
          this.filteredPlatos = dishes; 
        });
      }
    });
  }

  

  getCategorias() {
    this.categorias = [
      {
        id: 1,
        label: 'All',
        image:
          'https://firebasestorage.googleapis.com/v0/b/tallerfirebase-130d0.appspot.com/o/lo.png?alt=media&token=96f3fb38-fda6-4dc3-aaca-32c64b3207db',
        active: true,
      },
      {
        id: 2,
        label: 'Fast food',
        image:
          'https://firebasestorage.googleapis.com/v0/b/tallerfirebase-130d0.appspot.com/o/fastfood.png?alt=media&token=800ffa67-2333-47e1-b147-ccc1713592d4',
        active: true,
      },
      {
        id: 3,
        label: 'Ecuatoriana',
        image:
          'https://asohuecas.com/wp-content/uploads/2024/06/Recurso-29.png',
        active: true,
      },
      {
        id: 4,
        label: 'Asados',
        image:
          'https://firebasestorage.googleapis.com/v0/b/tallerfirebase-130d0.appspot.com/o/barbiqui.png?alt=media&token=c90ecf3d-decc-429c-817f-d0edc2b5d41c',
        active: true,
      }
      

    ];
  }


  filterByCategory() {
    if (this.selectedCategory === 'All') {
      this.filteredPlatos = [...this.platos];
    } else {
      this.filteredPlatos = this.platos.filter(plato => plato.categoria === this.selectedCategory);
    }
  }

  onCategorySelected(category: string) {
    this.selectedCategory = category;
    this.categorias.forEach(cat => cat.active = (cat.label === category));
    this.filterByCategory();
  }


  verDetalle(id:string){
this.router.navigate(['detalle', id]);
  }


  addItem(event: Event) {
    event.stopPropagation();
    if (this.isAuthenticated) {
      // Lógica para añadir el producto
      console.log('Producto añadido');
    } else {
      this.utilSvc.presentToast({
        message: 'Por favor, inicia sesión para añadir productos.',
        duration: 2000,
        position: 'bottom'
      });
    }
  }
}
