import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ClienteService } from 'src/app/services/cliente.service';
import { AdminService } from 'src/app/services/admin.service';

declare var iziToast: any;

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {
  public cliente: any = {};
  public token: any = '';
  public load_btn = false;

  constructor(private _clienteService: ClienteService, private _adminService: AdminService, private _router: Router) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
  }

  registro(registroForm: NgForm) {
    if (registroForm.valid) {
      this.load_btn = true;
      this._clienteService.create_admin(this.cliente, this.token).subscribe(
        response => {
          iziToast.show({
            backgroundColor: '#52BE80 ',
            class: 'text-success',
            position: 'topRight',
            message: 'Se ha registrado un nuevo cliente',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
          });

          this.cliente = {
            genero: '',
            nombres: '',
            email: '',
            telefono: '',
            dni: ''
          };

          this.load_btn = false;
          this._router.navigate(['panel/clientes']);
        },
        error => {
          console.log(error);
          iziToast.show({
            backgroundColor: '#dc3424',
            class: 'text-danger',
            position: 'topRight',
            message: 'Ocurrio un error en el servidor',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
          });
          this.load_btn = false;
        }
      );
    } else {
      iziToast.show({
        backgroundColor: '#dc3424',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos',
        messageColor: '#FFFFFF',
        progressBarColor: '#FFFFFF'
      });
      this.load_btn = false;
    }
  }
}
