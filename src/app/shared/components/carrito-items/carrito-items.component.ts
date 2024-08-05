import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Carrito } from 'src/app/models/carrito.model';

@Component({
  selector: 'app-carrito-items',
  templateUrl: './carrito-items.component.html',
  styleUrls: ['./carrito-items.component.scss'],
})
export class CarritoItemsComponent  implements OnInit {
  @Input() item: Carrito;
  @Output() increase = new EventEmitter<Carrito>();
  @Output() decrease = new EventEmitter<Carrito>();


  onIncrease() {
    this.increase.emit(this.item);
  }

  onDecrease() {
    this.decrease.emit(this.item);
  }
  ngOnInit() {}

}
