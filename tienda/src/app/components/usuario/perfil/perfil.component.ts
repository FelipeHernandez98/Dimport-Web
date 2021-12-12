import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';

declare var $: any;
declare var iziToast : any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente : any = {};
  public id : any ;
  public token : any ;

  constructor(
    private _clienteService:ClienteService
  ) {
    this.id = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');

    if(this.id){
      this._clienteService.cliente_guest(this.id,this.token).subscribe(
        response=>{
          this.cliente = response.data;
        }
      );
    }
   }

  ngOnInit(): void {
  }

  actualizar(actualizarForm: NgForm){
    if(actualizarForm.valid){
      this.cliente.password = $('#input_password').val();
      this._clienteService.cliente_actualizar_guest(this.id,this.cliente,this.token).subscribe(
        
          response=>{
            iziToast.show({
              backgroundColor: '#52BE80 ',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizo su perfil correctamente',
              messageColor: '#FFFFFF',
              progressBarColor: '#FFFFFF'
            });
          }
        
      );

    }else{
      iziToast.show({
        backgroundColor: '#dc3424',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos',
        messageColor: '#FFFFFF',
        progressBarColor: '#FFFFFF'
      });
    }
  }

}
