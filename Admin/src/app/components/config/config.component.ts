import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NgForm } from '@angular/forms';
import  {v4 as uuidv4}  from 'uuid';
import { GLOBAL } from 'src/app/services/GLOBAL';

declare var iziToast : any;
declare var $: any;

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public token : any;
  public config : any = {};

  public titulo_cat ='';
  public icono_cat ='';

  public file:any = null;
  public imgSelect:any = null;
  public url;

  constructor(private _adminService: AdminService) { 
      this.token = localStorage.getItem('token');
      this._adminService.obtener_config(this.token).subscribe(
        response=>{
          this.config = response.data;
          this.imgSelect = this.url + 'config/obtener_logo/' + this.config.logo;
    
          if(this.imgSelect != null){
            $('.cs-file-drop-icon').addClass("cs-file-drop-preview img-thunbnail rounded");
            $('.cs-file-drop-icon').removeClass("cs-file-drop-icon cxi-upload");
            this.ngDoCheck();
          }
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
        }
      );
      this.url = GLOBAL.url;
    }

  ngOnInit(): void {
  }

  agregar_cat(){
    if(this.titulo_cat && this.icono_cat){
      console.log(uuidv4());

      this.config.categorias.push({
        titulo: this.titulo_cat.replace(/\s+/g, ""),
        icono: this.icono_cat,
        _id:uuidv4()
      });

      this.titulo_cat='';
      this.icono_cat ='';

    }else{
      iziToast.show({
        backgroundColor: '#dc3424',
            class: 'text-danger',
            position: 'topRight',
            message: 'Debe ingresar un titulo e icono para la categoria',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
      });
    }
  }

  actualizar(confForm: NgForm){
    if(confForm.valid){
      let data = {
        titulo : confForm.value.titulo,
        serie : confForm.value.serie,
        correlativo : confForm.value.correlativo,
        categorias : this.config.categorias,
        logo : this.file,
      };

      this._adminService.actualizar_config(data, this.token).subscribe(
        response=>{
          iziToast.show({
            backgroundColor: '#52BE80 ',
            class: 'text-success',
            position: 'topRight',
            message: 'Se ha actualizado la configuracion de la tienda',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
          });
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

        $('.cs-file-drop-icon').addClass("cs-file-drop-preview img-thunbnail rounded");
        $('.cs-file-drop-icon').removeClass("cs-file-drop-icon cxi-upload");

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
  
  ngDoCheck(): void{
    $('.cs-file-drop-preview').html("<img src=" + this.imgSelect + ">");
  }

  eliminar_categoria(idx:any){
    this.config.categorias.splice(idx,1);
  }

}
