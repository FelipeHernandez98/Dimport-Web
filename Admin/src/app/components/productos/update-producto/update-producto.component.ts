import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
declare var iziToast:any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css']
})
export class UpdateProductoComponent implements OnInit {

  public producto : any = {};
  public config : any = {};
  public imgSelect : any | ArrayBuffer;
  public load_btn = false;
  public id : any;
  public token : any;
  public file: any = null;
  public url: any;
  public config_global : any = {};

  constructor(private _route : ActivatedRoute, private _productoService : ProductoService, private _adminService :AdminService ,
    private _router : Router) { 
    this.config = {
      height:500
    }
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._adminService.obtener_publico().subscribe(
      response=>{
        this.config_global = response.data;
      }
    )
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this._productoService.productooAdmin(this.id,this.token).subscribe(
          response=>{
            if(response.data == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;
              this.imgSelect = this.url + 'producto/obtener_portada/' + this.producto.portada;
            }
          },
          error=>{
            iziToast.show({
              backgroundColor: '#dc3424',
              class: 'text-danger',
              position: 'topRight',
              message: 'Ocurrio un problema en el servidor',
              messageColor: '#FFFFFF',
              progressBarColor: '#FFFFFF'
            });
          }
        );
      }
    );
  }

  actualizar(actualizarForm : NgForm){
    if(actualizarForm.valid){
      var data : any = {};
      
      if(this.file != undefined){
        data.portada = this.file;
      }

      data.titulo = this.producto.titulo;
      data.stock = this.producto.stock;
      data.precio = this.producto.precio;
      data.descripcion = this.producto.descripcion;
      data.contenido = this.producto.contenido;
      data.categoria = this.producto.categoria;
      
      

      this.load_btn = true;

      this._productoService.actualizarAdmin(this.id,data,this.token).subscribe(
        response =>{
          iziToast.show({
            backgroundColor: '#52BE80 ',
            class: 'text-success',
            position: 'topRight',
            message: 'Se ha actualizado el producto',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
          });
          this.load_btn = false;

          this._router.navigate(['/panel/productos']);
        },
        error=>{
          iziToast.show({
            backgroundColor: '#dc3424',
            class: 'text-danger',
            position: 'topRight',
            message: 'Ocurrio un problema en el servidor',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
          });
          this.load_btn = false;
        }
      )
    }else{
      iziToast.show({
        backgroundColor: '#dc3424',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe subir una portada',
        messageColor: '#FFFFFF',
        progressBarColor: '#FFFFFF'
      });
      this.load_btn = false;
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
      //asdf
      if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg') {

        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;
        console.log(this.imgSelect)

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
