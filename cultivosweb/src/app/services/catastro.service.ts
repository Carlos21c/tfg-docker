import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatastroService {
  
  private baseUrl = 'https://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx';

  constructor(private http: HttpClient) { }

  getCoordinates(cadastreReference: any): Observable<any> {
    const url = `${this.baseUrl}?service=wfs&version=2&request=getfeature&STOREDQUERIE_ID=GetParcel&refcat=${cadastreReference}&srsname=EPSG::4326`;
    return this.http.get(url, { responseType: 'text' });
  }
  

  getParcela(longitude: any, latitude: any): Observable<any> {
    const url = `https://ovc.catastro.meh.es/ovcservweb/ovcswlocalizacionrc/ovccoordenadas.asmx/Consulta_RCCOOR?SRS=EPSG:4326&Coordenada_X=${longitude}&Coordenada_Y=${latitude}`;
    return this.http.get(url, { responseType: 'text' });
  }
}
