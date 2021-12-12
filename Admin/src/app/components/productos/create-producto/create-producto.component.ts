import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {

  public producto: any = {
    categoria : ''
  };
  public file: any = null;
  public imgSelect: any | ArrayBuffer ='assets/img/default.jpg';
  public config : any = {};
  public token: any;
  public load_btn = false;
  public config_global : any = {};

  constructor(private _productoService : ProductoService, private _adminService : AdminService, 
    private _router : Router) { 
    this.config = {
      height:500
    }
    this.token = this._adminService.getToken();
    this._adminService.obtener_publico().subscribe(
      response=>{
        this.config_global = response.data;
      }
    )
  }

  ngOnInit(): void { }

  registro(registroForm: NgForm){
    if(registroForm.valid){
      if(this.file == undefined){
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe subir una portada para registrar'
        });
      }else{
        this.load_btn = true;
        this._productoService.create_admin(this.producto,this.file,this.token).subscribe(
          response=>{
            iziToast.show({
              backgroundColor: '#52BE80 ',
            class: 'text-success',
            position: 'topRight',
            message: 'Se ha registrado un nuevo producto',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
            });
            this.load_btn = false;
            this._router.navigate(['/panel/productos']);
          },
          error =>{
            console.log(error);
            this.load_btn = false;
          }
        );
      }
    }else{
      iziToast.show({
        backgroundColor: '#dc3424',
            class: 'text-danger',
            position: 'topRight',
            message: 'Los datos del fotmulario no son validos',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
      });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/error.png';
        this.file = null;
    }
  }

  fileChangeEvent(event : any) : void{
    var file : any;
    if(event.target.files && event.target.files[0]){
      file = <File>event.target.files[0];
    }else{
      iziToast.show({
        backgroundColor: '#dc3424',
            class: 'text-danger',
            position: 'topRight',
            message: 'La imagen no existe',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
      });
    }
    if(file.size <= 4000000){
      if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg' || file.type == 'image/svg') {

        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;
        reader.readAsDataURL(file);
        $('#input-portada').text(file.name);
        this.file = file;

      }else{
        iziToast.show({
          backgroundColor: '#dc3424',
            class: 'text-danger',
            position: 'topRight',
            message: 'El archivo debe ser una imagen',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/error.png';
        this.file = null;
      }
    }else{
      iziToast.show({
        backgroundColor: '#dc3424',
            class: 'text-danger',
            position: 'topRight',
            message: 'La imagen es muy grande',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/error.png';
      this.file = null;
    }
  }
  
}
