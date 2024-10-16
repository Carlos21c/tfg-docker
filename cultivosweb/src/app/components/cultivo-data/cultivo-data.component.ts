import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CultivoService } from '../../services/cultivo.service';
import { Cultivo } from '../../model/cultivo';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cultivo-data',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './cultivo-data.component.html',
  styleUrl: './cultivo-data.component.css'
})
export class CultivoDataComponent  implements OnInit{
  private route = inject (ActivatedRoute);
  private router = inject (Router);
  private dialog = inject(MatDialog);
  private cultivoService = inject(CultivoService); 

  codSigpac : string;
  year : number;
  cultivo : Cultivo; 

  constructor(){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.codSigpac = params['codSigpac'];
      this.year = params['year'];
    });
    this.cultivoService.getCultivo(this.codSigpac, this.year).subscribe((data : any) =>{
      this.cultivo = data;
    })
  }

  mostrarDatos(codigoSigpac: any, year: any): void{
    this.router.navigate(['file', codigoSigpac, year]);
  }

  eliminarDatos(codigoSigpac: any, year: any){
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cultivoService.deleteFile(codigoSigpac, year, this.cultivo).subscribe(()=>{
          this.ngOnInit();
          console.log('Acción realizada');
         });
      }else{
        console.log('Acción cancelada');
      }
    })
  }
}
