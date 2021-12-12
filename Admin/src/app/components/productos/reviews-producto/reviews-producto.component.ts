import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { GLOBAL } from 'src/app/services/GLOBAL';

@Component({
  selector: 'app-reviews-producto',
  templateUrl: './reviews-producto.component.html',
  styleUrls: ['./reviews-producto.component.css']
})
export class ReviewsProductoComponent implements OnInit {

  public id : any;
  public token : any;
  public producto : any = {};
  public reviews : Array<any> = [];

  public url : any;
  public load_btn = false;

  public page = 1;
  public pageSize = 10;

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
              this._productoService.obtener_reviews_producto(this.producto._id).subscribe(
                response => {
                  this.reviews = response.data
                }
              );
            }
          },
          error=>{
            console.log(error);
          }
        );
      }
    );
  }

}
