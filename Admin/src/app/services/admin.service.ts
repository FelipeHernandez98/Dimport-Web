import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { GLOBAL } from './GLOBAL';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  login(data: Object): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'administrador/login', data, { headers: headers });
  }

  getToken() {
    return localStorage.getItem('token');
  }

  public isAuthenticated(allowRoles: string[]): boolean {

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
        console.log('NO ACCCESO');
        localStorage.removeItem('token');
        return false;
      }
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
    return allowRoles.includes(decodedToken['role']);
  }

  obtener_config( token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.get(this.url + 'config/obtener_config', { headers: headers });
  }

  actualizar_config( data: any, token: string): Observable<any> {
    if(data.logo){
      let headers = new HttpHeaders({'Authorization':token});

      const fd = new FormData();
      fd.append('titulo',data.titulo);
      fd.append('serie',data.serie);
      fd.append('correlativo',data.correlativo);
      fd.append('categorias',JSON.stringify(data.categorias));
      fd.append('logo',data.logo);

      return this._http.put(this.url + 'config/actualizar_config', fd, { headers: headers });
    }else{
      let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
      return this._http.put(this.url + 'config/actualizar_config', data, { headers: headers });
    }

    
  }
  
    obtener_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'config/obtener_publico', { headers: headers });
  }

  obtener_mensajes_admin( token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.get(this.url + 'administrador/obtener_mensajes_admin', { headers: headers });
  }

  cerrar_mensaje_admin(id:any,data: Object, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.put(this.url + 'administrador/cerrar_mensaje_admin/'+id,data, { headers: headers });
  }

  obtener_ventas_admin(desde:any,hasta:any, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.get(this.url + 'administrador/obtener_ventas_admin/'+desde+'/'+hasta, { headers: headers });
  }

  obtener_orden(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'cliente/obtener_orden/' + id, { headers: headers });
  }

}
