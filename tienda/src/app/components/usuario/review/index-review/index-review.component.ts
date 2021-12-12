import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast : any;

@Component({
  selector: 'app-index-review',
  templateUrl: './index-review.component.html',
  styleUrls: ['./index-review.component.css']
})
export class IndexReviewComponent implements OnInit {

  public token : any;
  public load_data = true;
  public cliente_id : any;

  public page = 1;
  public pageSize = 15;

  public reviews : Array<any> = [];

  constructor(private _clienteService: ClienteService) { 
    this.token = localStorage.getItem('token');
    this.cliente_id = localStorage.getItem('_id');
  }

  ngOnInit(): void {
    this._clienteService.obtener_reviews(this.cliente_id, this.token).subscribe(
      response => {
        this.reviews = response.data;
        console.log(this.reviews);
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
    this.load_data = false;
  }

}
