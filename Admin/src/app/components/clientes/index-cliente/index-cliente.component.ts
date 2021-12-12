import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { identity } from 'rxjs';

declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent implements OnInit {

  public clientes: Array<any> = [];
  public filtro_buscar = '';

  public page = 1;
  public pageSize = 2;
  public token: any = '';

  public load_data = true;
  public load_btn = false;

  constructor(private _clienteService: ClienteService, private _adminService: AdminService ) {
    this.token = this._adminService.getToken();
   }
  

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._clienteService.listar(null,this.token).subscribe(
      response => {
        this.clientes = response.data;
        this.load_data = false;
      },
      error => {
        this.load_data = true;
        console.log(error);
      }
    );
  }

  filtro() {
    this.load_data = true;
    if (this.filtro_buscar) {
      this._clienteService.listar(this.filtro_buscar,this.token).subscribe(
        response => {
          this.load_data = false;
          this.clientes = response.data;
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.init_data();
    }
  }

  eliminar(id : string){
    this.load_btn = true;
    this._clienteService.eliminar_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
          backgroundColor: '#52BE80 ',
            class: 'text-success',
            position: 'topRight',
            message: 'Se ha eliminado un cliente',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
        });

        $('#delete-' + id).modal('hide');
        $('modal-backdrop').removeClass('show');
        
        this.load_btn = false;
        this.init_data();
      },
      error=>{
        iziToast.show({
          backgroundColor: '#dc3424',
            class: 'text-danger',
            position: 'topRight',
            message: 'Ocurrio un error en el servidor',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
        });

        $('#delete-' + id).modal('hide');
        $('modal-backdrop').removeClass('show');    
      }
      
    );
  }

}
