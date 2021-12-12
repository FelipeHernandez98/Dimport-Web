import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import  {v4 as uuidv4}  from 'uuid';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast : any;
declare var $: any;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent implements OnInit {

  public id : any;
  public token : any;
  public producto: any = {};

  public file : any = undefined;
  public load_btn : boolean = false;
  public load_btn_eliminar : boolean = false;
  public url;

  constructor(private _route : ActivatedRoute, private _productoService : ProductoService) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;   
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this.init_data();
      }
    );
  }

  init_data(): void{
    this._productoService.productooAdmin(this.id,this.token).subscribe(
      response=>{
        if(response.data == undefined){
          this.producto = undefined;
        }else{
          this.producto = response.data;
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

  subir_imagen(): void{
    if(this.file != undefined){
      let data = {
        imagen: this.file,
        _id: uuidv4() 
      };

      this._productoService.agregar_imagen_galeria(this.id, data, this.token).subscribe(
        response=>{
          this.init_data();
          $('#input-img').val('');
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
    }else{
      iziToast.show({
        backgroundColor: '#dc3424',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe seleccionar una imagen para subir',
        messageColor: '#FFFFFF',
        progressBarColor: '#FFFFFF'
      });
    }
  }

  eliminar_imagen(id: number): void{
    this.load_btn_eliminar = true;

    this._productoService.eliminar_imagen_galeria(this.id, {_id: id}, this.token).subscribe(
      response=>{
        iziToast.show({
          backgroundColor: '#52BE80 ',
          class: 'text-success',
          position: 'topRight',
          message: 'Se ha eliminado la imagen',
          messageColor: '#FFFFFF',
          progressBarColor: '#FFFFFF'
        });

        this.init_data();
        $('#input-img').val('');
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
    $('#delete-' + id).modal('hide');
    $('modal-backdrop').removeClass('show');
    this.load_btn_eliminar = false;
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
      $('#input-img').val('');
    }
    if(file.size <= 4000000){
      if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg' || file.type == 'image/svg') {
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
        this.file = undefined;
        $('#input-img').val('');
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
      $('#input-img').val('');
      this.file = undefined;
    }
  }
}
