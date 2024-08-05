import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Categoria } from 'src/app/models/categoria.model';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent  implements OnInit {
  @Input() item: Categoria;
  @Output() categoriaSeleccionada = new EventEmitter<string>();

  
  constructor() { }
  onSelectCategory() {
    this.categoriaSeleccionada.emit(this.item.label);
  }
  
  ngOnInit() {}

}
