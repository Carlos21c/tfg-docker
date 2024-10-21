import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Parcela } from '../model/parcela';
import { Observable } from 'rxjs';
import { Provincia } from '../model/provincia';

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {

  private baseUrl: String='http://localhost:8089/parcelas';
  private http = inject(HttpClient);

  constructor() { }

  list(dniPropietario: string){
    return this.http.get(`${this.baseUrl}/usuario/`+dniPropietario);
  }

  create(parcela: any){
    return this.http.post<Parcela>(`${this.baseUrl}/addParcela`, parcela);
  }
  update(oldSigpac: any, parcela: any){
    return this.http.put<Parcela>(`${this.baseUrl}/`+oldSigpac, parcela);
  }
  getParcela(codSigpac: any): Observable<Parcela>{
    return this.http.get<Parcela>(`${this.baseUrl}/cod/`+codSigpac);
  }
  getReferencia(refCatastral: any): Observable<Parcela>{
    return this.http.get<Parcela>(`${this.baseUrl}/ref/`+refCatastral);
  }
  delete(codSigpac: any):Observable<Boolean>{
    return this.http.delete<Boolean>(`${this.baseUrl}/delete/`+codSigpac);
  }
  obtenerIdPoblacion(nombre : any, idProvincia : any){
    const nombreMod = encodeURIComponent(nombre);
    return this.http.get('http://localhost:8089/poblaciones/nombre/'+nombreMod+'/'+idProvincia);
  }  
  obtenerNombrePoblacion(idPoblacion : any, codProv : any){
    return this.http.get('http://localhost:8089/poblaciones/id/'+idPoblacion+'/'+codProv);
  }  
  obtenerPoblacionesProvincia(codigo: any){
    return this.http.get('http://localhost:8089/poblaciones/prov/'+codigo);
  }
  obtenerTodasPoblaciones(){
    return this.http.get('http://localhost:8089/poblaciones');
  }
  
  obtenerProvincia(nombre:any): Observable<Provincia>{
    return this.http.get<Provincia>(`http://localhost:8089/provincias/`+nombre);
  }
  obtenerProvinciabyCod(codigo:any): Observable<Provincia>{
    return this.http.get<Provincia>(`http://localhost:8089/provincias/cod/`+codigo);
  }
  obtenerProvincias(){
    return this.http.get('http://localhost:8089/provincias');
  }

}
