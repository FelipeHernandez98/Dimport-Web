import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';

declare var iziToast : any;
declare var $ : any;

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit {

  public url: any;
  public token: any;
  public orden : any = {};
  public load_data = true;
  public id : any;

  public detalles : Array<any> = [];

  public value : number = 0;
  public review: any = {};

  constructor(private _clienteService: ClienteService, private _route: ActivatedRoute) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
      }
    );
    
    this.init_data();

   }

  ngOnInit(): void {
  }

  init_data(): void {
    this._clienteService.obtener_orden(this.id, this.token).subscribe(
      response => {
        if(response.data != undefined){
          this.orden = response.data;
          this.detalles = response.detalles;
          
          this.detalles.forEach((element : any) => {
            this._clienteService.obtener_review(element.producto._id, element.cliente).subscribe(
              response => {
                let emitido = false;
                if(response.data.length > 0){
                  emitido = true;
                }
                element.estado = emitido;
              }
            );
          });

        }else{
          this.orden = undefined;
        }
        this.load_data = false;
      },error => {
        this.orden = undefined;
        iziToast.show({
          backgroundColor: '#dc3424',
          class: 'text-danger',
          position: 'topRight',
          message: 'Ocurrio un problema con el servidor',
          messageColor: '#FFFFFF',
          progressBarColor: '#FFFFFF'
        }); 
        this.load_data = false;
      }
    );
  }

  openModal(detalle: any): void {
    this.review = {};
    this.review.producto = detalle.producto._id;
    this.review.cliente = detalle.cliente;
    this.review.venta = this.id;
  }

  emitir(id: any): void {
    if(this.review.review){
      this.review.estrellas = this.value;
      this._clienteService.emitir_review(this.review, this.token).subscribe(
        reponse => {
          iziToast.show({
            backgroundColor: '#52BE80 ',
            class: 'text-success',
            position: 'topRight',
            message: 'Se ha agregado tu reseña',
            messageColor: '#FFFFFF',
            progressBarColor: '#FFFFFF'
          });

          $('review-'+id).modal('hide');
          $('.modal-backdrop').removeClass('show');
          this.init_data();

        },error => {
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
        message: 'Ingresar un mensaje en la reseña',
        messageColor: '#FFFFFF',
        progressBarColor: '#FFFFFF'
      });
    }
    this.init_data();
  }

  onValueChange($event: number) {
    this.value = $event
  }

}
