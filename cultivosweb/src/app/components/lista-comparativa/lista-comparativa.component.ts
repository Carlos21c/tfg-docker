import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Cultivo } from '../../model/cultivo';
import { CultivoService } from '../../services/cultivo.service';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-comparativa',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, CommonModule],
  templateUrl: './lista-comparativa.component.html',
  styleUrls: ['./lista-comparativa.component.css']
})
export class ListaComparativaComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cultivoService = inject(CultivoService);
  private fb = inject(FormBuilder); 

  campos: any = {};
  tipo: string;
  provincia: number;
  poblacion: number;
  yearInicio: number;
  yearFin: number;
  distancia: number;
  longitude: number;
  latitude: number;
  codSigpac: string;
  year: number;
  cultivos: Cultivo[] = [];
  cultivoComparativo: Cultivo;
  compCultivo: boolean = false;
  sumaTotal: number[][] = [];
  csvFile: boolean = false;

  variacionForm: FormGroup;

  constructor(private location: Location) {
    this.variacionForm = this.fb.group({
      variacion: ['']
    })
  }  

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const camposSerialized = params['campos'];
      if (camposSerialized) {
        this.campos = camposSerialized; 
        const campos = JSON.parse(camposSerialized);
        this.tipo = campos.tipo;
        this.provincia = campos.provincia;
        this.poblacion = campos.poblacion;
        this.yearInicio = campos.yearInicio;
        this.yearFin = campos.yearFin;
        this.distancia = campos.distancia;
        this.longitude = campos.longitude;
        this.latitude = campos.latitude;
        this.codSigpac = campos.codSigpac;
        this.year = campos.year;     
      } else {
        this.csvFile = true;
      }
    });    
    if(this.csvFile){
      this.cultivos = this.cultivoService.getListComparacion();
    }else{
      this.cultivoService.compararTipo(this.tipo, this.provincia, this.poblacion, this.yearInicio, this.yearFin, this.codSigpac, this.year, this.distancia, this.longitude, this.latitude)
      .subscribe((lista: any) => {
        this.cultivos = lista; 
      });
      if(this.codSigpac!='' && this.year!=null){
        this.cultivoService.getCultivo(this.codSigpac, this.year).subscribe((data: any) =>{
          this.cultivoComparativo = data; 
          this.compCultivo = true; 
        })  
      };
  }
  }

  borrar(codSigpac: any, year: any) {
    this.cultivos = this.cultivos.filter(cultivo => !(cultivo.codSigpac === codSigpac && cultivo.year === year));
  }

  volver() {
    this.location.back();
  }

  mostrarDatos(codigoSigpac: any, year: any): void{
    this.router.navigate(['file', codigoSigpac, year]);
  }

  comparar() {    
    this.cultivoService.setListComparacion(this.cultivos);
    this.cultivoService.setCultivoComparativo(this.cultivoComparativo);
    let tam = this.cultivos.length; 
    let i, j;   
    for (let index = 0; index < tam; index++) {
      const cultivo = this.cultivos.at(index)?.datos; 
      if (typeof cultivo === 'string') {
        const cultivoDatos = JSON.parse(cultivo);
        for (let j = 12; j <= 39; j++) {
          if (!this.sumaTotal[j]) {
            this.sumaTotal[j] = [];
          }
          for (let i = 0; i < 21; i++) {
            if (this.sumaTotal[j][i] === undefined) {
              this.sumaTotal[j][i] = 0;
            }
          }
          for (let i = 2; i < 7; i++) {
            const valorStr = cultivoDatos[j]["_" + i];
            const valor = parseFloat(valorStr) || 0; 
            this.sumaTotal[j][i] += valor;
          }
          for (let i = 15; i < 20; i++) {
            const valorStr = cultivoDatos[j]["_" + i];
            const valor = parseFloat(valorStr) || 0;
            this.sumaTotal[j][i] += valor;
          }
        }         
      } else {
        console.log('Cultivo no es del tipo string');
      }
    }
    if(!this.compCultivo){ 
      var cultivo = this.cultivos.at(0)?.datos;               
      if(typeof(cultivo) === 'string'){
        let cultivoDatos = JSON.parse(cultivo);  
        for(j=12; j<=39; j++){
          for(i=2; i<7; i++){          
            this.sumaTotal[j][i] = this.sumaTotal[j][i]/tam;
            cultivoDatos[j]["_"+i] = this.sumaTotal[j][i];  
          }
          for(i=15; i<20; i++){          
            this.sumaTotal[j][i] = this.sumaTotal[j][i]/tam;
            cultivoDatos[j]["_"+i] = this.sumaTotal[j][i];
          }
        }  
        const cultivoPromedioStr = JSON.stringify(cultivoDatos);       
        this.router.navigate(['resultadoComparativa', cultivoPromedioStr, false]);
      }else{
        console.log('Cultivo no es del tipo string');
      }   
    }else{
      let datosReferencia = JSON.parse(this.cultivoComparativo.datos);
      if(typeof(this.cultivoComparativo.datos) === 'string'){          
        var cultivo = this.cultivos.at(0)?.datos;
        if(typeof cultivo === 'string'){
          let cultivoDatos = JSON.parse(cultivo);
          let desplazamiento = 0;
          for(j=12; j<=39; j++){        
            for(i=2; i<7; i++){          
              this.sumaTotal[j][i] = this.sumaTotal[j][i]/tam;
              cultivoDatos[j]["_"+i] = this.sumaTotal[j][i]; 
          }
            for(i=15; i<20; i++){          
              this.sumaTotal[j][i] = this.sumaTotal[j][i]/tam;
              cultivoDatos[j]["_"+i] = this.sumaTotal[j][i];
            }
            const newRow: { [key: string]: any } = {isComparativa: true};
            newRow[""] = 'MEDIA COMPARATIVA';
  
            for (let i = 2; i < 7; i++) {
                newRow["_"+i] = this.sumaTotal[j][i];
            }
            for (let i = 15; i < 20; i++) {
                newRow["_"+13] = 'MEDIA COMPARATIVA';
                newRow["_"+i] = this.sumaTotal[j][i];
            }          
            datosReferencia.splice(j+1+desplazamiento, 0, newRow);
            desplazamiento++;
          }               
          this.cultivoService.setMedias(JSON.stringify(cultivoDatos));  
          const cultivoPromedioStr = JSON.stringify(datosReferencia);
          this.cultivoService.setVariacion(this.variacionForm.get('variacion')?.value);
          this.router.navigate(['resultadoComparativa', cultivoPromedioStr, true]);   
        }
      }else{
        console.log('Cultivo comparativo no es del tipo string');
      }   
    }   
  }
}  

