import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast : any;

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {

  public token: any;
  public id: any;
  public direccion : any = {
    principal : false
  };

  public direcciones: Array<any> = [];
  public load_data = true;

  constructor(private _clienteService: ClienteService) { 
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
  }

  ngOnInit(): void {
    this.obtener_direcciones();
  }

  registrar(registroForm: NgForm){
    if(registroForm.valid){
      let data = {
        cliente : this.id,
        destinatario : this.direccion.destinatario,
        cedula : this.direccion.cedula,
        direccion : this.direccion.direccion,
        telefono : this.direccion.telefono,
        principal : this.direccion.principal
      };
  
      this._clienteService.registro_direccion_cliente(data, this.token).subscribe(
        response=>{
          this.obtener_direcciones();
          iziToast.show({
            backgroundColor: '#52BE80 ',
            class: 'text-success',
            position: 'topRight',
            message: 'Se ha agregado la direecion corrextamente',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
          });
        },error=>{
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

  obtener_direcciones(){
    this._clienteService.obtener_direccion_cliente(this.id, this.token).subscribe(
      response => {
        this.direcciones = response.data;
        this.load_data = false;
      },error =>{
        this.load_data = false;
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
    
  }

  establecer_principal(id: string){
    this._clienteService.cambiar_direccion_principal(id, this.id, this.token).subscribe(
      reponse =>{
        iziToast.show({
          backgroundColor: '#52BE80 ',
          class: 'text-success',
          position: 'topRight',
          message: 'Se actualizo la direccion principal',
          messageColor: '#FFFFFF',
          progressBarColor: '#FFFFFF'
        });
        this.obtener_direcciones();
      }
    );
  }
}


