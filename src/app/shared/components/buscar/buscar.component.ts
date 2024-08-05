import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss'],
})
export class BuscarComponent  implements OnInit {
  @Output() search = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {}

  onSearch(event: any) {
    const searchTerm = event.target.value || '';
    this.search.emit(searchTerm);
  }
}
