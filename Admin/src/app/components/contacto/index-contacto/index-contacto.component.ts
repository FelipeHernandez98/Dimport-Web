import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
declare var iziToast : any;
declare var $ : any;



@Component({
  selector: 'app-index-contacto',
  templateUrl: './index-contacto.component.html',
  styleUrls: ['./index-contacto.component.css']
})
export class IndexContactoComponent implements OnInit {

  constructor(
    private _adminServices:AdminService
  ) { 
    this.token = localStorage.getItem('token');
  }

  public mensajes : Array<any> = [];
  public load_data = true;
  public page =1;
  public pageSize = 20;
  public filtro = '';
  public token : any ;

  ngOnInit(): void {
    this.init_Data();
  }


  init_Data(){
    this._adminServices.obtener_mensajes_admin(this.token).subscribe(
      response=>{
        this.mensajes = response.data;
        this.load_data = false;
      }
    );
  }

  cerrar(id:any){
 this._adminServices.cerrar_mensaje_admin(id,{data:undefined},this.token).subscribe(
   respose=>{
    iziToast.show({
      title: 'SUCCESS',
      titleColor: '#1DC74C',
      color: '#FFF',
      class: 'text-seccess',
      position: 'topRight',
      message: 'Se cerro correctamente el mensaje' 
    });

    $('#estadoModal-'+id).modal('hide');
    $('.modal-backdrop').removeClass('hide');

    this.init_Data();

   }
  
 );
 }
}
