import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast : any;

@Component({
  selector: 'app-index-ordenes',
  templateUrl: './index-ordenes.component.html',
  styleUrls: ['./index-ordenes.component.css']
})
export class IndexOrdenesComponent implements OnInit {

  public token: any;
  public ordenes: Array<any> = [];
  public load_data = true;
  public cliente_id : any;

  public page = 1;
  public pageSize = 15;

  constructor(private _clienteService: ClienteService) { 
    this.token = localStorage.getItem('token');
    this.cliente_id = localStorage.getItem('_id');
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(): void {
    this._clienteService.obtener_ordenes(this.cliente_id, this.token).subscribe(
      response =>{
        this.ordenes = response.data;
      },error => {
        iziToast.show({
          backgroundColor: '#dc3424',
          class: 'text-danger',
          position: 'topRight',
          message: 'Ocurrio un problema con el servidor',
          messageColor: '#FFFFFF',
          progressBarColor: '#FFFFFF'
        });
      }
    );
    this.load_data = false;
  }

}
