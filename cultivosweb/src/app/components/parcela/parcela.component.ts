import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ParcelaService } from '../../services/parcela.service';
import { HeaderComponent } from '../header/header.component';
import { PropietarioService } from '../../services/propietario.service';
import { Provincia } from '../../model/provincia';
import { CatastroService } from '../../services/catastro.service';

@Component({
  selector: 'app-parcela',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './parcela.component.html',
  styleUrl: './parcela.component.css'
})
export class ParcelaComponent implements OnInit{
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private parcelaService = inject(ParcelaService);
  private propietarioService = inject(PropietarioService);  
  private catastroService = inject(CatastroService);
  private dniPropietario = ''; 
  private codigoPatron= /^ES-\d{2}-\d{2}-\d{4}-\d{2}-\d{4}$/;

  oldSigpac=""; 
  oldRef=""; 

  provincia : Provincia;
  provincias: string[]=[];
  poblaciones: string[]=[];

  form = this.fb.group({    
    codSigpac: ['', [Validators.required, Validators.pattern(this.codigoPatron)]],
    refCatastral: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(20), Validators.pattern('^[0-9A-Za-z]{20}$')]],
    dniPropietario: [''],
    extension: [0 , [Validators.required]],
    descripcion: ['', [Validators.required]],
    nombrePoblacion: ['', [Validators.required]],
    provincia: ['', [Validators.required]],
    esRegadio: [false, [Validators.required]]});
  isEditMode = false;

  constructor(){}

  ngOnInit(): void {
    this.dniPropietario = this.propietarioService.getDni() || '';
    this.route.params.subscribe(params => {
      const codSigpac = params['codSigpac'];
      if (codSigpac) {
        this.isEditMode = true;
        this.loadParcela(codSigpac);
      }
    });
    this.parcelaService.obtenerProvincias().subscribe((provincias : any) =>{
      for(let index = 0; index < provincias.length; index++){
        const element = provincias[index].nombreProvincia;
        this.provincias.push(element);
      }
    });
  }

  obtenerPoblaciones() {
    const nombreProvincia = this.form.value.provincia;       
    if(nombreProvincia === 'defecto'){
      this.poblaciones = [];
    }else{
      this.parcelaService.obtenerProvincia(nombreProvincia).subscribe((provincia: any) => {
        this.provincia = provincia;
        
        if (this.provincia && this.provincia.codigoProvincia) {
          this.poblaciones = [];
          this.parcelaService.obtenerPoblacionesProvincia(this.provincia.codigoProvincia).subscribe((poblaciones : any) => {
            for(let index = 0; index < poblaciones.length; index++){
              const element = poblaciones[index].nombrePoblacion;
              this.poblaciones.push(element);
            }
          })
        } else {
          console.error('El objeto provincia está indefinido o no tiene la propiedad codigoProvincia.');
        }
      });
    }
  }

  loadParcela(codSigpac: any): void{
    this.parcelaService.getParcela(codSigpac).subscribe(data => {
      this.oldSigpac = data.codSigpac;
      this.oldRef = data.refCatastral;
      this.parcelaService.obtenerProvinciabyCod(data.codigoProvincia).subscribe((responseProv : any) => {
        this.parcelaService.obtenerNombrePoblacion(data.codigoPoblacion, data.codigoProvincia).subscribe((response : any) => {
          this.form.patchValue({
            codSigpac: data.codSigpac,
            refCatastral: data.refCatastral,
            dniPropietario: data.dniPropietario,
            extension: data.extension,
            descripcion: data.descripcion,           
            provincia: responseProv.nombreProvincia,
            nombrePoblacion: response.nombrePoblacion,
            esRegadio: data.esRegadio 
          });        
          this.obtenerPoblaciones();
        });
      });
    })
  } 

  create(){
    if (this.form?.invalid) {
      console.log("Formulario inválido", this.form.errors);
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors = this.form.get(key)?.errors;
        if (controlErrors) {
          console.log(`Errores en el control ${key}:`, controlErrors);
        }
      });
      return;
    }  
    console.log('Valores del formulario:', this.form.value);
    const nombreProvincia = this.form.value.provincia; 
    var idProvincia;
    this.parcelaService.obtenerProvincia(nombreProvincia).subscribe((provincia: any) => {
      idProvincia = provincia.codigoProvincia;
      const nombrePoblacion = this.form.value.nombrePoblacion;
      const codigoSigpac = this.form.value.codSigpac;
      const referenciaCatastral = this.form.value.refCatastral;
      var exist = false;
      if(codigoSigpac && referenciaCatastral){
          if(this.isEditMode){ 
            this.parcelaService.getParcela(codigoSigpac).subscribe(data => {
              if(data != null && codigoSigpac != this.oldSigpac){
                alert('Ya existe este código sigpac en la base de datos.');
                return;
              } 
              
            })        
          }else{
              this.parcelaService.getParcela(codigoSigpac).subscribe(data => {
                if(data != null){
                  alert('Ya existe este código sigpac en la base de datos.');
                  return;
                } 
              })
          }   
      }  
      this.parcelaService.obtenerIdPoblacion(nombrePoblacion, idProvincia).subscribe((response : any) => {
          const poblacionId = response.codigoMunicipio;  
          this.catastroService.getCoordinates(this.form.value.refCatastral).subscribe(
            data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, 'application/xml');
        
                const coordinatesNode = xmlDoc.getElementsByTagName('gml:posList')[0];
        
                if (coordinatesNode) {
                    const coordinatesText = coordinatesNode.textContent;
        
                    if (coordinatesText) {
                      const coordinatesArray = coordinatesText.split(' ').map(parseFloat);

                      const formattedCoordinates = [];
                      for (let i = 0; i < coordinatesArray.length; i += 2) {
                          const latitud = coordinatesArray[i];
                          const longitud = coordinatesArray[i + 1];
                          formattedCoordinates.push([longitud, latitud]);
                      }
                  
                      const geojson = {
                        "type": "Polygon",
                        "coordinates": [formattedCoordinates]
                      };

                      const geojsonString = JSON.stringify(geojson).replace(/'/g, "\""); 
                      
                      console.log(geojsonString);
                                          
                      const parcela = {
                        codSigpac: this.form.value.codSigpac,
                        refCatastral: this.form.value.refCatastral,
                        dniPropietario: this.dniPropietario,
                        extension: this.form.value.extension,
                        descripcion: this.form.value.descripcion,
                        esRegadio: this.form.value.esRegadio,
                        codigoPoblacion: poblacionId,
                        codigoProvincia: response.codigoProvincia,
                        coordenadasString: geojsonString 
                      };
                      if(parcela){
                        if(this.isEditMode){ 
                            this.parcelaService.getReferencia(referenciaCatastral).subscribe(data => {
                              if(data != null && referenciaCatastral != this.oldRef){
                                alert ('Ya existe esta referencia catastral en la base de datos');
                              }else {
                                this.parcelaService.update(this.oldSigpac, parcela).subscribe(()=>{
                                  this.router.navigate(['parcelas']);
                                });
                              }
                            }) 
                        }else{   
                          this.parcelaService.getReferencia(referenciaCatastral).subscribe(data => {
                            if(data != null && referenciaCatastral != this.oldRef){
                              alert ('Ya existe esta referencia catastral en la base de datos');
                            }else {      
                              this.parcelaService.create(parcela).subscribe(()=>{
                                this.router.navigate(['parcelas']);
                              });
                            }
                          })    
                        }         
                      } else {
                          console.error("El objeto parcela es null");
                      }
                    } else {
                        console.error('El nodo de coordenadas está vacío.');
                        alert('No se han encontrado coordenadas');
                    }
                } else {
                    console.error('No se encontraron coordenadas en el XML.');
                    alert('No se han encontrado coordenadas');
                }
            },
            error => {
              console.error('Error al obtener información', error);
              alert('Ocurrió un error al obtener la información del catastro');
            }
          );
      },
      (error) => {
        console.error('Error al obtener el ID de la población', error);
      }
    );
    });    
  }
}
