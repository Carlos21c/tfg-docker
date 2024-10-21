import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Propietario } from '../model/propietario';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PropietarioService {
  
  private baseUrl = 'http://localhost:8089/api';
  private tokenKey = 'authToken';  
  private dniKey = ''; 
  private passKey = 'passwordKey';
  private http = inject(HttpClient);
  private router = inject(Router); 
  
  
  constructor() { }


  public login(email: string, password: string): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/login`, {email, password}).pipe(
      tap(response => {
        if(response.token){
          this.setToken(response.token);
          this.setPassword(password);
        }
        if(response.dniPropietario){
          this.setDni(response.dniPropietario);
        }
      })
    );
  }

  public getByEmail(email: string): Observable<Propietario>{
    return this.http.get<Propietario>(`${this.baseUrl}/email/`+email);
  }
  
  logout(): void{
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.dniKey);
    localStorage.removeItem(this.passKey);
    this.router.navigate(['login']);
  }

  create(propietario: any): Observable<Propietario>{
    return this.http.post<Propietario>(`${this.baseUrl}/signup`, propietario);
  }

  getByDni(dniPropietario: any): Observable<Propietario>{
    return this.http.get<Propietario>(`${this.baseUrl}/dni/`+dniPropietario);
  }

  update(dniPropietario: any, propietario: any){
    this.setDni(propietario.dniPropietario);
    return this.http.put<Propietario>(`${this.baseUrl}/update/`+dniPropietario, propietario);
  }

  delete(dniPropietario: any):Observable<Boolean>{
    return this.http.delete<Boolean>(`${this.baseUrl}/`+dniPropietario);
  }

  private setPassword(password: string): void{
    localStorage.setItem(this.passKey, password);
  }

  getPass(): string | null {
    return localStorage.getItem(this.passKey);
  }
  
  private setDni(dniPropietario: string): void{
    localStorage.setItem(this.dniKey, dniPropietario);
  }  
  getDni() : string | null {
    return localStorage.getItem(this.dniKey);
  }

  private setToken(token: string): void{
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null{
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean{
    const token = this.getToken();
    if(!token){
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; 
    return Date.now() < exp; 
  } 
}
