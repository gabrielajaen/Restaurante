import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Platos } from 'src/app/models/platos.model';

@Component({
  selector: 'app-platos',
  templateUrl: './platos.component.html',
  styleUrls: ['./platos.component.scss'],
})
export class PlatosComponent  implements OnInit {

  @Input() item:Platos;
  @Output() clicked = new EventEmitter();
  constructor() { }

  ngOnInit() {}

}
