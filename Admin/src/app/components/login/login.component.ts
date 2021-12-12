import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms'
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare var jQuery: any;
declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public usuario: any = {}; 
  public token: any = '';

  constructor(private _adminServices: AdminService, private _router: Router) {
    this.token = this._adminServices.getToken();
  }

  ngOnInit(): void {
    if(this.token){
      this._router.navigate(['/inicio']);
    }
  }

  login(loginForm: NgForm) {
    if (loginForm.valid) {

      let data = {
        email: this.user.email,
        password: this.user.password
      }

      this._adminServices.login(data).subscribe(
        response => {
          if (response.data == undefined) {
            iziToast.show({
              backgroundColor: '#dc3424',
              class: 'text-danger',
              position: 'topRight',
              message: response.message,
              messageColor: '#FFFFFF',
              progressBarColor: '#FFFFFF'
            });
          }else{
            this.usuario = response.message;

            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);

            this._router.navigate(['/panel/clientes']);
          }
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    }else {
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
