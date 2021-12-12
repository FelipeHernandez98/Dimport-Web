import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';

declare var iziToast : any;
declare var $ : any;

@Component({
  selector: 'app-detalle-ventas',
  templateUrl: './detalle-ventas.component.html',
  styleUrls: ['./detalle-ventas.component.css']
})
export class DetalleVentasComponent implements OnInit {

  public url: any;
  public token: any;
  public orden : any = {};
  public load_data = true;
  public id : any;

  public detalles : Array<any> = [];

  public totalstart : number = 5;
  public review: any = {};

  constructor( private _route: ActivatedRoute, private _adminService:AdminService) { 
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
      }
    );
  }

  ngOnInit(): void {

    this.init_data();
  }

  init_data(): void {
    this._adminService.obtener_orden(this.id, this.token).subscribe(
      response => {
        if(response.data != undefined){
          this.orden = response.data;
          this.detalles = response.detalles;
        

        }else{
          this.orden = undefined;
        }
        console.log(this.detalles);
       
      }
    );
  }

}
