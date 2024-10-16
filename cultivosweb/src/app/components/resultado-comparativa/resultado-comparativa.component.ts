import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Cultivo } from '../../model/cultivo';
import { CultivoService } from '../../services/cultivo.service';


interface Averages {
  [key: string]: string;
}

@Component({
  selector: 'app-resultado-comparativa',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './resultado-comparativa.component.html',
  styleUrl: './resultado-comparativa.component.css'
})
export class ResultadoComparativaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cultivoService = inject(CultivoService);

  variacion: number;
  datos: string;
  medias: string;
  marcarDiffs: string;
  cultivo: Cultivo;
  cultivos: Cultivo[] = [];
  csvData1: any[] = [];  
  csvData2: any[] = []; 
  csvHeaders1: string[] = []; 
  csvHeaders2: string[] = []; 

  csvHeadersDescarga: string[] = [];
  csvDataDescarga: string[] = [];
  
  csvHeadersAvg: string[] = [];
  csvDataAvg: string[] = [];
  
  currentPage: number = 1;


  constructor(private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.datos = params['datos'];
      this.medias = this.cultivoService.getMedias();
      this.marcarDiffs = params['marcarValores'];
      const variacionAux = this.cultivoService.getVariacion();      
      if(variacionAux != ''){
        this.variacion = Number(variacionAux);
      }else{
        this.variacion = 0.05;
      }      
      if (typeof this.datos === 'string') {
        const jsonData = JSON.parse(this.datos);
        if(this.marcarDiffs === 'true'){
          this.marcarValoresCSV(jsonData);
        } else{
          this.convertJSONtoCSV(jsonData);
        }        
        if(typeof this.medias === 'string'){
          const jsonMedia = JSON.parse(this.medias);
          this.csvDataAvg = this.convertAvgCsv(jsonMedia);
        }
        this.csvDataDescarga = this.convertCsv(jsonData);
      } else {
        console.error('Error: datos is not a string');
      }      
    });
    this.cultivos = this.cultivoService.getListComparacion();
    this.cultivo = this.cultivoService.getCultivoComparativo(); 
  }

  marcarValoresCSV(jsonData: any[]): void { 
    if (jsonData.length > 0) {
        const headers = Object.keys(jsonData[0]);
        this.csvHeaders1 = headers.slice(0, 7);
        this.csvHeaders2 = headers.slice(13, 20);      

        for (let i = 11; i < jsonData.length; i++) {
            const item = jsonData[i];
            const obj1: { [key: string]: any } = { isComparativa: item.isComparativa };
            const obj2: { [key: string]: any } = { isComparativa: item.isComparativa };

            if (!item.isComparativa && i > 11) {
                const comparativa = jsonData[i + 1]; 

                this.csvHeaders1.forEach(header => {
                    obj1[header] = item[header];

                    const difference = (item[header]) - (comparativa[header]);
                    if (difference > this.variacion) {
                        obj1[`${header}_background`] = 'red';
                    } else if (difference < -this.variacion) {
                        obj1[`${header}_background`] = 'green';
                    }
                });

                this.csvHeaders2.forEach(header => {
                    obj2[header] = item[header];

                    const difference = (item[header]) - (comparativa[header]);
                    if (difference > this.variacion) {
                        obj2[`${header}_background`] = 'red';
                    } else if (difference < -this.variacion) {
                        obj2[`${header}_background`] = 'green';
                    }
                });
            } else {
                this.csvHeaders1.forEach(header => obj1[header] = item[header]);
                this.csvHeaders2.forEach(header => obj2[header] = item[header]);
            }
            this.csvData1.push(obj1);
            this.csvData2.push(obj2);
        }
    }
  }

  convertJSONtoCSV(jsonData: any[]): void { 
    if (jsonData.length > 0) {
      const headers = Object.keys(jsonData[0]);
      this.csvHeaders1 = headers.slice(0, 7);
      
      this.csvHeaders2 = headers.slice(13, 20);      
  
      for (let i = 11; i < jsonData.length; i++) {
        const item = jsonData[i];
        const obj1: { [key: string]: any } = { isComparativa: item.isComparativa };
        const obj2: { [key: string]: any } = { isComparativa: item.isComparativa };

        this.csvHeaders1.forEach(header => obj1[header] = item[header]);
        this.csvHeaders2.forEach(header => obj2[header] = item[header]);

        this.csvData1.push(obj1);
        this.csvData2.push(obj2);
      }
    }
  }

  convertCsv(jsonData: any[]): any[] {
    const result = [];
  
    if (jsonData.length > 0) {
      this.csvHeadersDescarga = Object.keys(jsonData[0]);

      for (let i = 0; i < jsonData.length; i++) {
        const item = jsonData[i];
        const obj: { [key: string]: any } = {};
        for (const key of this.csvHeadersDescarga) {
          obj[key] = item[key];
        }
        result.push(obj);
      }
    }  
    return result;
  }

  convertAvgCsv(jsonData: any[]): any[] {
    const result = [];
  
    if (jsonData.length > 0) {
      this.csvHeadersAvg = Object.keys(jsonData[0]);

      for (let i = 0; i < jsonData.length; i++) {
        const item = jsonData[i];
        const obj: { [key: string]: any } = {};
        for (const key of this.csvHeadersAvg) {
          obj[key] = item[key];
        }
        result.push(obj);
      }
    }  
    return result;
  }

  downloadAllCSV(): void {
    this.downloadCSV(this.csvDataDescarga, this.csvHeadersDescarga, 'resultadosComparacion.csv');
  }

  downloadAvg(): void {
    this.downloadCSV(this.csvDataAvg, this.csvHeadersDescarga, 'mediasComparacion.csv');
  }

  downloadCSV(data: any[], headers: string[], fileName: string): void {
    const csvRows = [];
    const headerRow = headers.join(',');
    csvRows.push(headerRow);

    data.forEach(row => {
      const values = headers.map(header => {
        const escaped = ('' + (row[header] || '')).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  downloadCultCSV() {
    const headers = ['Codigo Sigpac', 'Year'];
    const csvData = this.convertToCSV(this.cultivos, headers);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cultivosComparacion.csv';
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(objArray: any[], headers: string[]): string {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let csv = headers.join(',') + '\n'; 

    array.forEach((item: { codSigpac: any; year: any; }) => {
      const row = [item.codSigpac, item.year].join(',');
      csv += row + '\n'; 
    });

    return csv;
  }
}
