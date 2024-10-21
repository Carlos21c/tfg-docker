import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CultivoService } from '../../services/cultivo.service';
import { ParcelaService } from '../../services/parcela.service';
import { PropietarioService } from '../../services/propietario.service';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-cultivo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './cultivo.component.html',
  styleUrls: ['./cultivo.component.css']
})
export class CultivoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cultivoService = inject(CultivoService);
  private parcelaService = inject(ParcelaService);
  private propietarioService = inject(PropietarioService);
  private dniPropietario = ''; 

  oldSigpac = "";
  oldYear = 0;  

  form = this.fb.group({
    codSigpac: ['', [Validators.required]],
    year: [0, [Validators.required]],
    tipoCultivo: ['defecto', [Validators.required]],
    descripcion: ['', [Validators.required]],
    variedad: [''],
    datos: ['']
  });

  isEditMode = false;
  codigos: string[] = [];
  jsonContent: any;
  jsonData: any;
  tipos: string[] = [];
  datosOld : string; 
  workbook: any;
  csvData : any; 

  constructor() {}

  ngOnInit(): void {
    this.dniPropietario = this.propietarioService.getDni() || '';

    this.cultivoService.tipo().subscribe((tipos: any) => {
      this.tipos = tipos;
    });

    this.route.params.subscribe(params => {
      const codSigpac = params['codSigpac'];
      const year = params['year'];
      if (codSigpac && year) {
        this.isEditMode = true;
        this.loadCultivo(codSigpac, year);
      }
    });

    this.parcelaService.list(this.dniPropietario).subscribe((parcelas : any) => {
      for (let index = 0; index < parcelas.length; index++) {
        const element = parcelas[index].codSigpac;
        this.codigos.push(element);
      }
    });
  }

  loadCultivo(codSigpac: string, year: number): void {
    this.cultivoService.getCultivo(codSigpac, year).subscribe(data => {
      this.oldSigpac = data.codSigpac;
      this.oldYear = data.year;
      this.datosOld = data.datos;
      this.form.patchValue({
        codSigpac: data.codSigpac,
        year: data.year,
        descripcion: data.descripcion,
        tipoCultivo: data.tipoCultivo,
        variedad: data.variedad    
      });       
    });
  }

  create(): void {
    if (this.form.invalid) {
      return;
    }
    this.convertToCsvThenJson();
    const cultivo = this.form.value;
    if (!this.jsonContent) {
      cultivo.datos = this.datosOld;
    } else {
      cultivo.datos = this.jsonContent;
    }
    const codSigpac = this.form.value.codSigpac;
    const yearCultivo = this.form.value.year;
    if(this.isEditMode){ 
      if(codSigpac && yearCultivo){
        this.cultivoService.getCultivo(codSigpac, yearCultivo).subscribe(data => {
          if(data != null && codSigpac != this.oldSigpac && yearCultivo != this.oldYear){
            alert('Ya existe un cultivo con ese código sigpac en el mismo año.');
          }else{
              this.cultivoService.update(this.oldSigpac, this.oldYear, cultivo).subscribe((response) => {
              console.log('Cultivo actualizado: ', response);
              this.router.navigate(['cultivos']);
            })
          }
        })
      } 
    }else{
      if(codSigpac && yearCultivo){
        this.cultivoService.getCultivo(codSigpac, yearCultivo).subscribe(data => {
          if(data != null){
            alert('Ya existe un cultivo con ese código sigpac en el mismo año.');
          }else{
            this.cultivoService.create(cultivo).subscribe((response) => {
              console.log('Cultivo creado: ', response);
              this.router.navigate(['cultivos']);
            });  
          }
        })
      }     
    }
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) throw new Error('No se pueden usar múltiples archivos');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      this.workbook = XLSX.read(bstr, { type: 'binary' });
    };
    reader.readAsBinaryString(target.files[0]);    
  }

  convertToCsvThenJson() {
    if (!this.workbook) {
      console.error('No se ha cargado ningún archivo');
      return;
    }

    const sheetName = this.workbook.SheetNames[0];
    const ws: XLSX.WorkSheet = this.workbook.Sheets[sheetName];

    if (!ws) {
      console.error(`Hoja ${sheetName} no encontrada`);
      return;
    }

    this.csvData = XLSX.utils.sheet_to_csv(ws);

    console.log(this.csvData);
    
    Papa.parse(this.csvData, {
      header: true,
      complete: (result) => {
        this.jsonData = result.data;
        this.jsonContent = JSON.stringify(this.jsonData, null, 2);
        console.log(this.jsonContent);
      }
    });
  }
}
