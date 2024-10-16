import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Cultivo } from '../model/cultivo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CultivoService {

  private baseUrl: String='http://localhost:8089/cultivos';
  private http = inject(HttpClient); 
  private listComparativa: any[] = [];
  private cultivoComparativo: Cultivo; 
  private variacion: string = ''; 
  private medias: string = ''; 

  constructor() { }

  //Lista de cultivos que van a usarse para la comparación
  setListComparacion(list: any[]) {
    this.listComparativa = list;
  }
  getListComparacion() {
    return this.listComparativa;
  }
  
  //Cultivo contra el que se va a comparar, es decir, cultivo desde el que se pulsa 'Comparar CVC'
  setCultivoComparativo(cultivo: Cultivo){
    this.cultivoComparativo = cultivo;
  }
  getCultivoComparativo(){
    return this.cultivoComparativo;
  }

  //Variación elegida por el usuario
  setVariacion(variacion : string){
    this.variacion = variacion;
  }
  getVariacion(){
    return this.variacion;
  }

  //Fichero con las medias calculadas en el filtro
  setMedias(medias: string){
    this.medias = medias;
  }
  getMedias(){
    return this.medias; 
  }

  listPropietario(dni : string){
    return this.http.get(`${this.baseUrl}/propietario/`+dni);
  }
  
  listParcela(codigo : string){
    return this.http.get(`${this.baseUrl}/cultivo/`+codigo);
  }
  
  create(cultivo: any){
    return this.http.post<Cultivo>(`${this.baseUrl}`, cultivo);
  }

  update(oldSigpac: any, oldYear: any, cultivo: any){
    return this.http.put<Cultivo>(`${this.baseUrl}/`+oldSigpac+`/`+oldYear, cultivo);
  }

  getCultivo(codSigpac: any, year: any): Observable<Cultivo>{
    return this.http.get<Cultivo>(`${this.baseUrl}/`+codSigpac+`/`+year)
  }

  delete(codSigpac: any, year: any) : Observable<Boolean>{
    return this.http.delete<Boolean>(`${this.baseUrl}/delete/`+codSigpac+`/`+year);
  }

  deleteFile(codSigpac: any, year: any, cultivo : Cultivo){
    return this.http.put(`${this.baseUrl}/deleteFile/`+codSigpac+`/`+year, cultivo);
  }

  getByYear(year: any, dni: any){
    return this.http.get(`${this.baseUrl}/year/`+year+`/`+dni);
  }

  getByRange(year: any, dni: any){
    return this.http.get(`${this.baseUrl}/range/`+year+`/`+dni);
  }

  getByType(tipo: any, dni: any){
    return this.http.get(`${this.baseUrl}/type/`+tipo+`/`+dni);
  }

  tipo(){
    return this.http.get(`${this.baseUrl}/tipo`);
  }

  compararTipo(tipo: any, provincia: any, poblacion: any, yearInicio: any, yearFin: any, codSigpac: any, year: any, distancia: any, longitude: any, latitude: any){
    let params = new HttpParams();
    if (tipo) {
      params = params.set('tipo', tipo);
    }
    if (provincia) {
      params = params.set('provincia', provincia);
    }
    if (poblacion) {
      params = params.set('poblacion', poblacion);
    }
    if (yearInicio) {
      params = params.set('yearS', yearInicio);
    }
    if (yearFin) {
      params = params.set('yearE', yearFin);
    }
    if(distancia){
      params = params.set('distancia', distancia);
      params = params.set('longitude', longitude);
      params = params.set('latitude', latitude); 
    }
    if (codSigpac && year){
      params = params.set('codSigpac', codSigpac);
      params = params.set('year', year);
    }
    return this.http.get(`${this.baseUrl}/comparator`, { params });
  }
  
  encontrarCentro(codSigpac: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/centro/${codSigpac}`);
  }
}
