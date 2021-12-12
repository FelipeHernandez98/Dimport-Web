import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { GLOBAL } from './GLOBAL';
import { FormBuilder } from '@angular/forms';
import { idText } from 'typescript';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  public url;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  create_admin(data: any, file: any, token: string ): Observable<any> {
    let headers = new HttpHeaders({'Authorization':token});

    const fd = new FormData();
    fd.append('titulo',data.titulo);
    fd.append('stock',data.stock);
    fd.append('precio',data.precio);
    fd.append('descripcion',data.descripcion);
    fd.append('contenido',data.contenido);
    fd.append('categoria',data.categoria);
    fd.append('portada',file);

    return this._http.post(this.url + 'producto/crear_producto', fd, { headers: headers });
  }

  listar(filtro:string | null, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.get(this.url + 'producto/listar_producto_filtro/' + filtro, { headers: headers });
  }

  productooAdmin(id:string, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.get(this.url + 'producto/obtener_producto/' + id, { headers: headers });
  }

  actualizarAdmin( id: any, data: any, token: string ): Observable<any> {
    if(data.portada){
      let headers = new HttpHeaders({'Authorization':token});

      const fd = new FormData();
      fd.append('titulo',data.titulo);
      fd.append('stock',data.stock);
      fd.append('precio',data.precio);
      fd.append('descripcion',data.descripcion);
      fd.append('contenido',data.contenido);
      fd.append('categoria',data.categoria);
      fd.append('portada',data.portada);

      return this._http.put(this.url + 'producto/actualizar_producto/'+id, fd, { headers: headers });
    }else{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.put(this.url + 'producto/actualizar_producto/' + id, data, { headers: headers });
    }
  }

  eliminar_producto(id : string,token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.delete(this.url + 'producto/eliminar_producto/' + id, { headers: headers });
  }
    
  listar_producto(id : any,token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'producto/listar_producto/' + id, { headers: headers });
  }

  eliminar_inventario(id : any,token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.delete(this.url + 'producto/eliminar_inventario/' + id, { headers: headers });
  }

  crear_inventario(data : any,token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'producto/crear_inventario', data, { headers: headers });
  }

  actualizar_variedades( id: any, data: any, token: string ): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.put(this.url + 'producto/actualizar_variedades/' + id, data, { headers: headers });
  }

  agregar_imagen_galeria(id : string, data: any, token: string ): Observable<any> {
    let headers = new HttpHeaders({'Authorization':token});
    const fd = new FormData();
    fd.append('_id',data._id);
    fd.append('imagen',data.imagen);
    return this._http.put(this.url + 'producto/agregar_imagen_galeria/' + id, fd, { headers: headers });
  }

  eliminar_imagen_galeria( id: any, data: any, token: string ): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.put(this.url + 'producto/eliminar_imagen_galeria/' + id, data, { headers: headers });
  }

  obtener_reviews_producto(id : any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this._http.get(this.url + 'producto/obtener_reviews_producto/' + id, { headers: headers });
  }
}
