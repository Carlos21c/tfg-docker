import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router} from '@angular/router';
import { CultivoService } from '../../services/cultivo.service';
import { Cultivo } from '../../model/cultivo';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-parcela-data',
  standalone: true,
  imports: [HeaderComponent, CapitalizePipe],
  templateUrl: './parcela-data.component.html',
  styleUrl: './parcela-data.component.css'
})
export class ParcelaDataComponent implements OnInit{
  private route = inject (ActivatedRoute);
  private router = inject (Router);
  private cultivoService = inject(CultivoService);   
  private dialog = inject(MatDialog);

  cultivos : Cultivo[] = [];
  codSigpac : string;

  ordenAscendenteYear: boolean = true;
  ordenAscendenteTipo: boolean = true; 

  constructor(){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.codSigpac = params['codSigpac'];
    });
    this.cultivoService.listParcela(this.codSigpac).subscribe((cultivos: any) => {
      this.cultivos = cultivos;
    });
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
  ordenarTipo() {
    this.cultivos.sort((a, b) => {
      const comparison = a.tipoCultivo.localeCompare(b.tipoCultivo);
      return this.ordenAscendenteTipo ? comparison : -comparison;
    });    
    this.ordenAscendenteTipo = !this.ordenAscendenteTipo;
  }
  
  ordenarYear(){
    this.cultivos.sort((a, b) => {
      const comparison = a.year - b.year;
      return this.ordenAscendenteYear ? comparison : -comparison;
    });
    this.ordenAscendenteYear = !this.ordenAscendenteYear;
  }

}
