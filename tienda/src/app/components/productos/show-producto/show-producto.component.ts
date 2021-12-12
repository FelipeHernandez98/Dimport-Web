import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { io } from "socket.io-client";

declare var tns: any;
declare var lightGallery: any;
declare var iziToast: any;


@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {

  public slug: string = '';
  public producto: any = {};
  public url;
  public productos_rec: Array<any> = [];
  public token: any;
  public reviews : Array<any> = [];

  public page = 1;
  public pageSize = 10;

  public count_five_star = 0;
  public count_four_star = 0;
  public count_three_star = 0;
  public count_two_star = 0;
  public count_one_star = 0;
  public total_puntos = 0;

  public five_porcent = 0;
  public four_porcent = 0;
  public three_porcent = 0;
  public two_porcent = 0;
  public one_porcent = 0;

  public estrellas = 0;

  public carrito_data: any = {
    variedad: '',
    cantidad: 1
  };

  public btn_cart = false;
  public socket = io('http://localhost:4201');

  constructor(private _route: ActivatedRoute, private _guestService: GuestService, private _clienteService: ClienteService) {

    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params => {
        this.slug = params['slug'];
        this._guestService.obtener_producto_slug(this.slug).subscribe(
          response => {
            this.producto = response.data;

            this._guestService.obtener_reviews_producto(this.producto._id).subscribe(
              response=>{
                this.reviews = response.data;
                this.reviews.forEach((element: any) => {
                  if(element.estrellas == 5){
                    this.count_five_star += 1;
                  }else if(element.estrellas == 4){
                    this.count_four_star += 1;
                  }else if(element.estrellas == 3){
                    this.count_three_star += 1;
                  }else if(element.estrellas == 2){
                    this.count_two_star += 1;
                  }else if(element.estrellas == 2){
                    this.count_one_star += 1;
                  }

                });
                this.five_porcent = (this.count_five_star * 100) / this.reviews.length;
                this.four_porcent = (this.count_four_star * 100) / this.reviews.length;
                this.three_porcent = (this.count_three_star * 100) / this.reviews.length;
                this.two_porcent = (this.count_two_star * 100) / this.reviews.length;
                this.one_porcent = (this.count_one_star * 100) / this.reviews.length;

                this.estrellas = ((this.count_five_star * 5) + (this.count_four_star * 4) + (this.count_three_star * 3) +
                (this.count_two_star * 2) + (this.count_one_star * 1)) / this.reviews.length;
              }
            );

            this._guestService.listar_productos_recomendados(this.producto.categoria).subscribe(
              response => {
                this.productos_rec = response.data;
              },
              error => {
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
          },
          error => {
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
      }
    );
  }

  ngOnInit(): void {

    setTimeout(() => {
      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        navContainer: "#cs-thumbnails",
        navAsThumbnails: true,
        gutter: 15,
      });

      var e = document.querySelectorAll(".cs-gallery");
      if (e.length) {
        for (var t = 0; t < e.length; t++) {
          lightGallery(e[t], { selector: ".cs-gallery-item", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
        }
      }

      tns({
        container: '.cs-carousel-inner-two',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        controlsContainer: "#custom-controls-related",
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          480: {
            items: 2,
            gutter: 24
          },
          700: {
            items: 3,
            gutter: 24
          },
          1100: {
            items: 4,
            gutter: 30
          }
        }
      });
    }, 500
    );

    var e = document.querySelectorAll(".cs-gallery");
    if (e.length) {
      for (var t = 0; t < e.length; t++) {
        lightGallery(e[t], { selector: ".cs-gallery-item", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
      }
    }
  }

  agregar_producto() {
    if (this.carrito_data.variedad) {
      if (this.carrito_data.cantidad <= this.producto.stock) {

        let data = {
          producto: this.producto._id,
          cliente: localStorage.getItem('_id'),
          cantidad: this.carrito_data.cantidad,
          variedad: this.carrito_data.variedad,
        }
        this.btn_cart = true;

        this._clienteService.agregar_carrito_cliente(data, this.token).subscribe(
          response => {
            if (response.data == undefined) {
              iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                class: 'text-danger',
                position: 'topRight',
                message: 'El producto ya existe en el carrito'
              });
              this.btn_cart = false;
            } else {
              console.log(response);
              iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-seccess',
                position: 'topRight',
                message: 'Se agrego el producto al carrito'
              });
              this.socket.emit('add-carrito-add', { data: true });
              this.btn_cart = false;
            }

          }
        );


      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'La maxima cantidad disponible es:' + this.producto.stock
        });
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Seleccione una variedad de producto'
      });
    }
  }

}
