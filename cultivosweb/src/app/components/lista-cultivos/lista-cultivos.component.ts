import { Component, OnInit, inject } from '@angular/core';
import { CultivoService } from '../../services/cultivo.service';
import { Router } from '@angular/router';
import { Cultivo } from '../../model/cultivo';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { PropietarioService } from '../../services/propietario.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { CommonModule } from '@angular/common';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-lista-cultivos',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, CapitalizePipe, CommonModule],
  templateUrl: './lista-cultivos.component.html',
  styleUrl: './lista-cultivos.component.css'
})
export class ListaCultivosComponent implements OnInit{
  private cultivoService = inject(CultivoService);
  private router = inject(Router);
  private fb = inject(FormBuilder);  
  private propietarioService = inject(PropietarioService);
  private dialog = inject(MatDialog);
  private dniPropietario = '';


  cultivos: Cultivo[] = [];
  displayedCultivos: any[] = [];
  page: number = 1; 
  pageSize: number = 20; 
  totalPages: number = 0; 
  tipos: string[] = [];
  yearForm: FormGroup;
  tipoForm: FormGroup;

  
  jsonContent: any;
  jsonData: any;
  workbook: any;
  sheetName: string = '';
  csvData : any; 

  codSigpac: any;
  year: any;
  cultivo: Cultivo;  
  
  ordenAscendenteSigpac: boolean = true;  
  ordenAscendenteYear: boolean = true;
  ordenAscendenteTipo: boolean = true; 
  ordenAscendenteCVC: boolean = true;   

  constructor(){
    this.yearForm = this.fb.group({
      yearCultivo:['']
    })
    this.tipoForm = this.fb.group({
      tipoCultivo:['']
    })
  }

  ngOnInit(): void {
    this.dniPropietario = this.propietarioService.getDni() || '';
    this.cultivoService.listPropietario(this.dniPropietario).subscribe((cultivos : any) =>{
      this.cultivos = cultivos;
      this.totalPages = Math.ceil(this.cultivos.length / this.pageSize);
      this.updateDisplayedCultivos();
    })
    this.cultivoService.tipo().subscribe((tipos: any) => {
      this.tipos = tipos;
    });
  }

  updateDisplayedCultivos(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedCultivos = this.cultivos.slice(startIndex, startIndex + this.pageSize);    
  }

  goToPage(page: number): void {
    this.page = page;
    this.updateDisplayedCultivos();
  }
  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updateDisplayedCultivos();
    }
  }
  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updateDisplayedCultivos();
    }
  }

  addCultivo(){
    this.router.navigate(['addCultivo']);
  }

  getByYear(){
    const yearCultivo = this.yearForm.get('yearCultivo')?.value;
    if(yearCultivo){
      if(yearCultivo < 2000){
        alert('El año mínimo debe ser el 2000');
        console.log('El campo del año no cumple con el mínimo');
      }else{
        this.cultivoService.getByYear(yearCultivo, this.dniPropietario).subscribe((cultivos: any) =>{
          this.cultivos = cultivos;
          this.updateDisplayedCultivos();
        });
      }
    }else{
      alert('El campo del año no puede estar vacío');
      console.log('El campo del año está vacío');      
    }
  }

  getRango(){
    const yearCultivo = this.yearForm.get('yearCultivo')?.value;
    if(yearCultivo){
      if(yearCultivo < 2000){
        alert('El año mínimo debe ser el 2000');
        console.log('El campo del año no cumple con el mínimo');
      }else{
        this.cultivoService.getByRange(yearCultivo, this.dniPropietario).subscribe((cultivos: any) =>{
          this.cultivos = cultivos;
          this.updateDisplayedCultivos();
        })
      }
    }else{
      alert('El campo del año no puede estar vacío');
      console.log('El campo del año está vacío')
    }
  }

  getTipoCultivo(){
    const tipo = this.tipoForm.get('tipoCultivo')?.value;
    if(!tipo){
      alert('El campo tipo no puede estar vacío');
    }else{      
      if(tipo != 'defecto'){
        this.cultivoService.getByType(tipo, this.dniPropietario).subscribe((cultivos: any) => {
          this.cultivos = cultivos;
          this.updateDisplayedCultivos();
        })
      }else{
        alert('Debes seleccionar un valor diferente al por defecto');
        console.log('No es un valor para filtrar');
      } 
    }
  }

  editCultivo(codSigpac: any, year: any): void {
    this.router.navigate(['editCultivo', codSigpac, year]);
  }

  deleteCultivo(codSigpac: any, year: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cultivoService.delete(codSigpac, year).subscribe((eliminado: Boolean) => {
          if(eliminado){
            console.log('Eliminado el cultivo con código '+codSigpac);
            this.ngOnInit();
          }else{
            console.log('No se ha podido eliminar el cultivo '+codSigpac);
          }
        });
      }else{
        console.log('Acción cancelada');
      }
    })
  }

  thisCultivo(codSigpac: string, year: number) {
    this.router.navigate(['cultivo', codSigpac, year]);
  }

  mostrarDatos(codigoSigpac: any, year: any): void{
    this.router.navigate(['file', codigoSigpac, year]);
  }

  comparator(codSigpac: any, year:any) {
    this.router.navigate(['comparador', codSigpac, year]);
  }

  triggerFileInput(codSigpac: any, year: any) {
    this.codSigpac = codSigpac;
    this.year = year;
    this.cultivoService.getCultivo(this.codSigpac, this.year).subscribe((data: any) => {
      this.cultivo = data;
    })
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) throw new Error('No se pueden usar múltiples archivos');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      this.workbook = XLSX.read(bstr, { type: 'binary' });

      this.convertToCsvThenJson();
    };
    reader.onerror = (error) => {
      console.error('Error leyendo el archivo: ', error);
    };
    reader.readAsBinaryString(target.files[0]);    
  }

  convertToCsvThenJson() {
    if (!this.workbook) {
      console.error('No se ha cargado ningún archivo');
      return;
    }

    const sheetName = this.sheetName || this.workbook.SheetNames[0];
    const ws: XLSX.WorkSheet = this.workbook.Sheets[sheetName];

    if (!ws) {
      console.error(`Hoja ${sheetName} no encontrada`);
      return;
    }

    this.csvData = XLSX.utils.sheet_to_csv(ws);
    
    Papa.parse(this.csvData, {
      header: true,
      complete: (result) => {
        this.jsonData = result.data;
        this.jsonContent = JSON.stringify(this.jsonData, null, 2);
        console.log(this.jsonContent);
      }
    });
    this.cultivo.datos = this.jsonContent;
    this.cultivoService.update(this.codSigpac, this.year, this.cultivo).subscribe((response) => {
      console.log('Cultivo actualizado: ', response);
      this.ngOnInit(); 
    })
  }

  ordenarSigpac() {
    this.cultivos.sort((a, b) => {
      const comparison = a.codSigpac.localeCompare(b.codSigpac);
      return this.ordenAscendenteSigpac ? comparison : -comparison;
    });
    this.updateDisplayedCultivos();
    this.ordenAscendenteSigpac = !this.ordenAscendenteSigpac;
  }  
  ordenarTipo() {
    this.cultivos.sort((a, b) => {
      const comparison = a.tipoCultivo.localeCompare(b.tipoCultivo);
      return this.ordenAscendenteTipo ? comparison : -comparison;
    });    
    this.updateDisplayedCultivos();
    this.ordenAscendenteTipo = !this.ordenAscendenteTipo;
  }
  ordenarCVC(){
    this.cultivos.sort((a, b) => {
      const comparison = ((a.datos!=null) === (b.datos!=null)) ? 0 : a.datos===null ? 1 : -1;
      return this.ordenAscendenteCVC ? comparison : -comparison;
    });
    this.updateDisplayedCultivos();
    this.ordenAscendenteCVC = !this.ordenAscendenteCVC;
  }

  ordenarYear(){
    this.cultivos.sort((a, b) => {
      const comparison = a.year - b.year;
      return this.ordenAscendenteYear ? comparison : -comparison;
    });
    this.updateDisplayedCultivos();
    this.ordenAscendenteYear = !this.ordenAscendenteYear;
  }
}
