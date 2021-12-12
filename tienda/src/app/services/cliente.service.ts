import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { GLOBAL } from './GLOBAL';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  login_cliente(data : Object): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + 'cliente/login',data, {headers: headers});  
  }

  cliente_guest(id : String, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'cliente/cliente_guest/' + id,{ headers: headers });
  }

  cliente_actualizar_guest(id : String,data : Object,token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.put(this.url + 'cliente/cliente_actualizar_guest/'+id,data, {headers: headers});  
  }

  public isAuthenticated(): boolean {

    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }
    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);

      console.log(decodedToken);

      if(helper.isTokenExpired(token)){
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        localStorage.clear();
        return false;
      }
    } catch (error) {
      localStorage.clear();
      return false;
    }
    return true;
  }
  
  obtener_publico(): Observable<any> { 
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'config/obtener_publico', { headers: headers });
  }

  listar_producto_publico(filtro:string  | null ): Observable<any> { 
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'producto/listar_producto_publico/'+filtro, { headers: headers });
  }

  agregar_carrito_cliente(data : Object, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'carrito/agregar_carrito_cliente' ,data,{ headers: headers });
  }

  obtener_carrito_cliente(id : String, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'carrito/obtener_carrito_cliente/' + id ,{ headers: headers });
  }
  
  eliminar_carrito_cliente(id : String, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.delete(this.url + 'carrito/eliminar_carrito_cliente/' + id ,{ headers: headers });
  }

  registro_direccion_cliente(data : Object, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'cliente/registro_direccion', data,  { headers: headers });
  }

  obtener_direccion_cliente(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'cliente/obtener_direcciones/' + id,  { headers: headers });
  }

  cambiar_direccion_principal(id: string, cliente: string, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.put(this.url + 'cliente/cambiar_direccion_principal/' + id + '/' + cliente, {data:true}, { headers: headers });
  }

  obtener_direccion_principal(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'cliente/obtener_direccion_principal/' + id, { headers: headers });
  }

  registro_compra_cliente(data : Object, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'venta/registro_compra_cliente', data,  { headers: headers });
  }
  
  obtener_ordenes(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'cliente/obtener_ordenes/' + id, { headers: headers });
  }

  obtener_orden(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'cliente/obtener_orden/' + id, { headers: headers });
  }

  emitir_review(data : Object, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'cliente/emitir_review', data,  { headers: headers });
  }

  obtener_review(id: string, cliente: String): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this._http.get(this.url + 'cliente/obtener_review_producto/' + id + '/' + cliente, { headers: headers });
  }

  obtener_reviews(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'cliente/obtener_reviews/' + id, { headers: headers });
  }

}
