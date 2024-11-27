import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { CultivoService } from '../../services/cultivo.service';
import 'leaflet/dist/leaflet.css';
import 'leaflet-sidebar-v2';
import 'leaflet-sidebar-v2/css/leaflet-sidebar.css';
import { ParcelaService } from '../../services/parcela.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Provincia } from '../../model/provincia';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, tap, switchMap } from 'rxjs';
import { FormstateService } from '../../services/formstate.service';
import { CatastroService } from '../../services/catastro.service';

@Component({
  selector: 'app-comparador',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './comparador.component.html', 
  styleUrls: ['./comparador.component.css']
})

export class ComparadorComponent implements OnInit {

  private map: L.Map;
  private router = inject(Router);
  private cultivoService = inject(CultivoService);
  private parcelaService = inject(ParcelaService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private formStateService = inject(FormstateService);
  private catastroService = inject(CatastroService);

  compareCultivo = false;

  
  listaCultivos : any[] = [];

  codSigpac: string;
  year: number;

  tipos: string[] = [];
  provincia: Provincia;
  provincias: string[]=[];
  poblaciones: string[]=[];
  campos: any = {};  
  selectedCultivo: string | null = null;
  longitude : number = 0;
  latitude : number =0;

  currentMarker : L.Marker | null = null;
  currentCircle: L.Circle | null = null;

  form = this.fb.group({
    tipoCultivo:['', [Validators.required]],
    provincia:[''],
    nombrePoblacion:[''],
    yearInicio:[0],
    yearFin:[0],
    distancia: [0]
  })

  constructor() {}

  createMap(){
    // Mostrar únicamente España
    var bounds = L.latLngBounds(
      L.latLng(35.946850084, -9.557417356),
      L.latLng(43.798600763, 4.318095118)
    );

    // Mapa básico de open street
    var basicLayer = L.tileLayer.wms('https://www.ign.es/wms-inspire/ign-base', {
      layers: "IGNBaseTodo",
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Ortofoto
    var pnoa = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&", {
      layers: "OI.OrthoimageCoverage",//nombre de la capa (ver get capabilities)
      format: 'image/png',
      transparent: true,
      version: '1.3.0',//wms version (ver get capabilities)
      attribution: "PNOA WMS. Cedido por © Instituto Geográfico Nacional de España"
    });

    // Capa que pinta el contorno de las parcelas
    var parcelaLayer = L.tileLayer.wms("https://wms.mapa.gob.es/sigpac/wms", {
      layers: "AU.Sigpac:recinto",
      format: "image/png",
      transparent: true,
      crossOrigin: true,
      noWrap: true,
      crs: L.CRS.EPSG3857,
      version: "1.3.0"
    });

    // Precargar la basicLayer cargada
    this.map = L.map('map', {
      layers: [basicLayer],
      zoomControl: false
    });
    this.map.fitBounds(bounds);
    this.map.setView([39.4682868, -6.3792825], 13);

    this.map.attributionControl.setPrefix("<a href='https://leafletjs.com/' target='_blank'>Leaflet</a>");
    var baseMaps = {
      "Mapa topográfico": basicLayer,
      "Mapa ortogonal": pnoa
    };
    var overlayMaps = {
      "Parcelas": parcelaLayer
    };
    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(this.map);
    const zoomControl = L.control.zoom({
      position: 'topright'
    }).addTo(this.map);
  }

  ngOnInit(): void {
    const savedFormState = this.formStateService.getFormState();
    if (savedFormState) {
      this.form.patchValue(savedFormState);
      this.selectedCultivo = this.form.value.tipoCultivo || '';
      this.obtenerPoblaciones();
    }

    this.cultivoService.tipo().subscribe((tipos: any) => {
      this.tipos = tipos;
    });
    this.route.params.subscribe(params => {
      this.codSigpac = params['codSigpac'];
      this.year = params['year'];
      if (this.codSigpac && this.year) {
        this.compareCultivo = true;
        this.cultivoService.encontrarCentro(this.codSigpac).subscribe((data : any) => {
          const coordenadas = data[0];
          this.longitude = coordenadas[0];
          this.latitude = coordenadas[1];
        });
        this.loadComparator(this.codSigpac, this.year);
      }
    });
    this.parcelaService.obtenerProvincias().subscribe((provincias : any) =>{
      for(let index = 0; index < provincias.length; index++){
        const element = provincias[index].nombreProvincia;
        this.provincias.push(element);
      }
    });
    this.createMap();
    // Inicialización de la sidebar
    var sidebar = L.control.sidebar({
      container: 'sidebar',
      position: 'left'
    }).addTo(this.map);  


    document.getElementById('addMarkerBtn')?.addEventListener('click', () => {
      this.map.once('click', (e: L.LeafletMouseEvent) => {
        this.latitude = e.latlng.lat;
        this.longitude = e.latlng.lng;   
        
        if (this.currentMarker) {
          this.map.removeLayer(this.currentMarker);
        }

        this.catastroService.getParcela(this.longitude, this.latitude).subscribe((data)=>{
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'application/xml');

          const namespaceURI = 'http://www.catastro.meh.es/';
          const ldtNode = xmlDoc.getElementsByTagNameNS(namespaceURI, 'ldt')[0];
          
          const ldtText = ldtNode ? ldtNode.textContent : 'Información no disponible';

          this.currentMarker = L.marker([this.latitude, this.longitude]).addTo(this.map)
          .bindPopup('Se ha añadido un marcador en la parcela: '+ldtText)
          .openPopup();
        });
      });
    });
    
    document.getElementById('removeMarkerBtn')?.addEventListener('click', () => {
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
        this.currentMarker = null;        
      } else {
        console.log('No hay marcadores para eliminar');
      }
      if (this.currentCircle) {
        this.map.removeLayer(this.currentCircle);
        this.currentCircle = null;
      }
      this.longitude = 0;
      this.latitude = 0;
    });

    document.getElementById('drawAreaBtn')?.addEventListener('click', () => {
      this.pintarArea();
    });

  }
  
  pintarArea() {
    if (!this.latitude || !this.longitude || !this.form.value.distancia) {
      alert("Error: Coordenadas o distancia no definidas.");
      return;
    }
    var radio = (Number(this.form.value.distancia)*1000)/2;
    if (isNaN(radio)) {
      console.error("Error: La distancia no es un número válido.");
      return;
    }    
    var center = L.latLng(this.latitude, this.longitude);
    if (this.currentCircle) {
      this.map.removeLayer(this.currentCircle);
    }
    this.currentCircle = L.circle(center, {
      color: 'blue',
      fillColor: '#3f5eff',
      fillOpacity: 0.3,
      radius: radio
    }).addTo(this.map);
  
    this.map.setView(center, 12);
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

  loadComparator(codSigpac: any, year: any){    
    this.parcelaService.getParcela(codSigpac).subscribe((parcela: any) => {
      this.parcelaService.obtenerProvinciabyCod(parcela.codigoProvincia).subscribe((dataProv: any) => {
        this.parcelaService.obtenerNombrePoblacion(parcela.codigoPoblacion, parcela.codigoProvincia).subscribe((dataPobl: any)=>{
          this.cultivoService.getCultivo(codSigpac, year).subscribe(cultivo  => {
            this.selectedCultivo = cultivo.tipoCultivo; 

            this.form.patchValue({
              tipoCultivo: cultivo.tipoCultivo,
              provincia: dataProv.nombreProvincia,
              nombrePoblacion: dataPobl.nombrePoblacion,
              yearInicio: cultivo.year,
              yearFin: cultivo.year 
            });      

            this.obtenerPoblaciones();
          });
        });
      });
    })    
  }

  filtrar() {
    const tipo = this.form.value.tipoCultivo;    
    if (!tipo) {
      alert('El campo tipo no puede estar vacío');
    } else {
      const yearInicio = this.form.value.yearInicio ?? 0;
      const yearFin = this.form.value.yearFin ?? 0;      
      if(yearFin === 0 || yearInicio <= yearFin){
        if (tipo != 'defecto') {
          this.campos.tipo = tipo;   
          const observables = [];
    
          if (this.form.value.provincia != '' && this.form.value.provincia != 'defecto') {
            const nombreProvincia = this.form.value.provincia;
          
            const provinciaObservable = this.parcelaService.obtenerProvincia(nombreProvincia).pipe(
              tap((data: any) => {
                this.campos.provincia = data.codigoProvincia;
              })
            );
          
            observables.push(provinciaObservable);
          
            if (this.form.value.nombrePoblacion != '' && this.form.value.nombrePoblacion != 'defecto') {
              const nombrePoblacion = this.form.value.nombrePoblacion;
          
              const poblacionObservable = this.parcelaService.obtenerProvincia(nombreProvincia).pipe(
                switchMap((provinciaData: any) => {
                  this.campos.provincia = provinciaData.codigoProvincia;
          
                  return this.parcelaService.obtenerIdPoblacion(nombrePoblacion, provinciaData.codigoProvincia).pipe(
                    tap((poblacionData: any) => {
                      this.campos.poblacion = poblacionData.codigoMunicipio;
                    })
                  );
                })
              );
          
              observables.push(poblacionObservable);
            }
          }
          
    
          if (this.form.value.yearInicio != 0) {
            this.campos.yearInicio = this.form.value.yearInicio;
          }
          if (this.form.value.yearFin != 0) {
            this.campos.yearFin = this.form.value.yearFin;
          }
          if (this.form.value.distancia !=0 ) {
            if(this.longitude !=0 && this.latitude !=0){
              this.campos.distancia = this.form.value.distancia;
              this.campos.longitude = this.longitude;
              this.campos.latitude = this.latitude;
            }else{
              console.log('No se ha seleccionado ningún punto con el marcador');
              alert('No se ha elegido un marcador para aplicar la distancia, por lo que no se filtrará por distancia.');
            }
          }
          if (this.compareCultivo){
            this.campos.codSigpac = this.codSigpac;
            this.campos.year = this.year;
          }
          console.log(this.campos);
          if (observables.length > 0) {
            forkJoin(observables).subscribe(() => {
              this.navigateWithCampos();
            });
          } else {
            this.navigateWithCampos();
          }
        } else {
          alert('El campo tipo no puede ser por defecto');
        }
      }else{
        alert('El año de fin no puede ser menor que el año de inicio');
      }
    }
  }
  
  guardarEstadoFormulario() {
    this.formStateService.saveFormState(this.form.value);
  }

  navigateWithCampos() {
    this.guardarEstadoFormulario();
    const camposSerialized = JSON.stringify(this.campos);
    this.router.navigate(['list-comparator', camposSerialized]);
  }

  onTipoCultivoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCultivo = selectElement.value;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result as string;
      const rows = csvData.split('\n');
      const params = [];
      for (const row of rows) {
        const cols = row.split(',');
        if (cols.length === 2) {
          params.push({ codigoSigpac: cols[0], year: cols[1] });
        }
      }      
      for(let i=1; i < params.length; i++){
        var codSigpac = params[i].codigoSigpac;
        var year = params[i].year;
        this.cultivoService.getCultivo(codSigpac, year).subscribe(data => {
          this.listaCultivos.push(data);
        });
      }
    };
    this.cultivoService.setListComparacion(this.listaCultivos);
    reader.readAsText(file);
    this.router.navigate(['list-comparator', '']);
  }

  importarCsv(){
    const fileInput = document.getElementById('csvFile');
    if (fileInput) {
      fileInput.click();
    }
  }
}

