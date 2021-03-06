import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public productos: Array<any> = [];
  public filtro_buscar = '';
  public token: any = '';
  
  public arr_productos: Array<any> = [];
  public load_btn = false;
  public load_data = true;
  public url;

  public page = 1;
  public pageSize = 5;

  constructor(private _productoService: ProductoService) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._productoService.listar(null, this.token).subscribe(
      response=>{
        this.productos = response.data;
        this.load_data = false;

        this.productos.forEach(element => {
          this.arr_productos.push({
            titulo: element.titulo,
            stock: element.stock,
            precio: element.precio,
            categoria: element.categoria,
            nventas: element.nventas
          });
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
  }

  filtro(){
    this.load_data = true;
    if (this.filtro_buscar) {
      this._productoService.listar(this.filtro_buscar, this.token).subscribe(
        response => {
          this.load_data = false;
          this.productos = response.data;
        }
      );
      this.load_data = false;
    } else {
      this.init_data();
    }
  }

  resetear(){
    this.filtro_buscar = '';
    this.init_data();
    $('#input-filtro-buscar').focus();
  }

  eliminar(id : string){
    this.load_btn = true;
    this._productoService.eliminar_producto(id,this.token).subscribe(
      response=>{
        iziToast.show({
          backgroundColor: '#52BE80 ',
          class: 'text-success',
          position: 'topRight',
          message: 'Se ha eliminado un producto',
          messageColor: '#FFFFFF',
          progressBarColor: '#FFFFFF'
        });

        $('#delete-' + id).modal('hide');
        $('modal-backdrop').removeClass('show');

        this.load_btn = false;
        this.init_data();
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

        $('#delete-' + id).modal('hide');
        $('modal-backdrop').removeClass('show'); 
      }
    );
  }

  donwload_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");
  
    worksheet.addRow(undefined);
    for (let x1 of this.arr_productos){
      let x2=Object.keys(x1);

      let temp=[]
      for(let y of x2){
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }

    let fname='REP01- ';

    worksheet.columns = [
      { header: 'Producto', key: 'col1', width: 30},
      { header: 'Stock', key: 'col2', width: 15},
      { header: 'Precio', key: 'col3', width: 15},
      { header: 'Categoria', key: 'col4', width: 25},
      { header: 'N?? ventas', key: 'col5', width: 15},
    ]as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname+'-' + new Date().valueOf() + '.xlsx');
    });
  }

}
