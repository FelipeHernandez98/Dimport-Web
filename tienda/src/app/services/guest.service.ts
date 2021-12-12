import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { GLOBAL } from './GLOBAL';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  obtener_producto_slug(slug: string): Observable<any> { 
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'producto/obtener_producto_slug/' + slug, { headers: headers });
  }

  listar_productos_recomendados(categoria: string): Observable<any> { 
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'producto/listar_productos_recomendados/' + categoria, { headers: headers });
  }

  listar_producto_nuevo_publico(): Observable<any> { 
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'producto/listar_producto_nuevo_publico/', { headers: headers });
  }

  obtener_reviews_producto(id : any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this._http.get(this.url + 'producto/obtener_reviews_producto/' + id, { headers: headers });
  }

  listar_producto_masvendido_publico(): Observable<any> { 
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'producto/listar_producto_masvendido_publico/', { headers: headers });
  }

  enviar_mensaje_contacto(data:any): Observable<any> { 
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'cliente/enviar_mensaje_contacto/', data,{ headers: headers });
  }
  
}
