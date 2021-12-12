
import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast : any;

@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrls: ['./variedad-producto.component.css']
})
export class VariedadProductoComponent implements OnInit {

  public id : any;
  public token : any;
  public producto: any = {};  
  public inventarios : Array<any> = [];

  public nueva_variedad : string = '';
  public load_btn : boolean = false;
  public url;

  constructor(private _route : ActivatedRoute, private _productoService : ProductoService) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;   
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
              this._productoService.listar_producto(this.producto._id,this.token).subscribe(
                response=>{
                  this.inventarios = response.data;
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

  agregar_variedad(): void{
    if(this.nueva_variedad){
      this.producto.variedades.push({titulo: this.nueva_variedad});
      this.nueva_variedad = '';
    }else{
      iziToast.show({
        backgroundColor: '#dc3424',
            class: 'text-danger',
            position: 'topRight',
            message: 'El campo de variedad ',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
      });
    }
  }

  eliminar_variedad(id : any){
    this.producto.variedades.splice(id, 1);
  }

  actualizar(){
    if(this.producto.titulo_variedad){
      if(this.producto.variedades.length >=1){

        this.load_btn = true;
        this._productoService.actualizar_variedades( this.id,
          {
            titulo_variedad: this.producto.titulo_variedad,
            variedades: this.producto.variedades
          }, this.token).subscribe(
            response=>{
              iziToast.show({
                backgroundColor: '#52BE80 ',
                class: 'text-success',
                position: 'topRight',
                message: 'Se ha registrado las variedades',
                messageColor: '#FFFFFF',
                progressBarColor: '#FFFFFF'
              });
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
        this.load_btn = false;
      }
    }
  }
            

}
