import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute } from '@angular/router';
import { CultivoService } from '../../services/cultivo.service';
import { Cultivo } from '../../model/cultivo';
import { CommonModule } from '@angular/common';
import { KeysPipe } from '../../pipes/keys.pipe';
import { ValuesPipe } from '../../pipes/values.pipe';

@Component({
  selector: 'app-cultivo-file',
  standalone: true,
  imports: [HeaderComponent, CommonModule, KeysPipe, ValuesPipe],
  templateUrl: './cultivo-file.component.html',
  styleUrls: ['./cultivo-file.component.css'],
})
export class CultivoFileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cultivoService = inject(CultivoService); 

  codSigpac: string;
  year: number;
  cultivo: Cultivo;
  csvData1: any[] = [];  
  csvData2: any[] = []; 
  csvHeaders1: string[] = []; 
  csvHeaders2: string[] = []; 

  csvHeadersDescarga: string[] = [];
  csvDataDescarga: string[] = [];
  
  currentPage: number = 1;

  constructor() {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.codSigpac = params['codSigpac'];
      this.year = params['year'];
      this.loadCultivoData();
    });
  }

  loadCultivoData(): void {
    this.cultivoService.getCultivo(this.codSigpac, this.year).subscribe((data: any) => {
      this.cultivo = data;
      const datos = data.datos;
      if (typeof datos === 'string') {
        const jsonData = JSON.parse(datos);
        this.splitJsonToCSV(jsonData);
        this.csvDataDescarga = this.convertCsv(jsonData);
      } else {
        console.error('Error: datos is not a string');
      }
    });
  }

  splitJsonToCSV(jsonData: any[]): void {
    if (jsonData.length > 0) {
      const headers = Object.keys(jsonData[0]);
      this.csvHeaders1 = headers.slice(0, 7);
      this.csvHeaders2 = headers.slice(13, 20);      
  
      for (let i = 10; i < jsonData.length; i++) {
        const item = jsonData[i];
        const allEmpty = Object.values(item).every(value => value === '');
        if (allEmpty) {
          continue;
        }
        const obj1: { [key: string]: any } = {};
        const obj2: { [key: string]: any } = {};

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

  downloadAllCSV(): void {
    this.downloadCSV(this.csvDataDescarga, this.csvHeadersDescarga, 'tablas'+'_'+this.cultivo.codSigpac+'_'+this.cultivo.year+'.csv');
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
  
}
