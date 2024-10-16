import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultaApiService {

  private baseUrl = "";

  constructor(private http : HttpClient) { }

  getByCultivo(tipo : any){
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
