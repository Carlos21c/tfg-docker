import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ParcelaService } from '../../services/parcela.service';
import { Router } from '@angular/router';
import { Parcela } from '../../model/parcela';
import { HeaderComponent } from '../header/header.component';
import { PropietarioService } from '../../services/propietario.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lista-parcelas',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './lista-parcelas.component.html',
  styleUrls: ['./lista-parcelas.component.css']
})
export class ListaParcelasComponent implements OnInit {
  private parcelaService = inject(ParcelaService);
  private router = inject(Router);
  private propietarioService = inject(PropietarioService); 
  private dialog = inject(MatDialog);
  private dniPropietario = ''; 

  parcelas: Parcela[] = [];
  displayedParcelas: any[] = [];
  page: number = 1; 
  pageSize: number = 20; 
  totalPages: number = 0; 
  ordenAscendenteSigpac: boolean = true; 
  ordenAscendenteRegadio: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.dniPropietario = this.propietarioService.getDni() || '';
    if (this.dniPropietario) {
      this.parcelaService.list(this.dniPropietario).subscribe((parcelas: any) => {
        this.parcelas = parcelas;
        this.totalPages = Math.ceil(this.parcelas.length / this.pageSize);
        this.updateDisplayedParcelas();
      });
    } else {
      console.log('No se ha encontrado el DNI del propietario en la sesión.');
    }
  }

  updateDisplayedParcelas(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedParcelas = this.parcelas.slice(startIndex, startIndex + this.pageSize);    
  }
  goToPage(page: number): void {
    this.page = page;
    this.updateDisplayedParcelas();
  }
  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updateDisplayedParcelas();
    }
  }
  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updateDisplayedParcelas();
    }
  }

  thisParcela(codSigpac: string) {
    this.router.navigate(['parcela', codSigpac]);
  }

  addParcela() {
    this.router.navigate(['addParcela']);
  }

  editParcela(codSigpac: any) {
    this.router.navigate(['editParcela', codSigpac]);
  }

  eliminarParcela(codSigpac: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.parcelaService.delete(codSigpac).subscribe((eliminado: Boolean) => {
          if (eliminado) {
            console.log('Eliminada la parcela con código ' + codSigpac);
            this.ngOnInit();
          } else {
            console.log('No se ha podido eliminar la parcela ' + codSigpac);
          }
        });
      } else {
        console.log('Acción cancelada');
      }
    });
  }

  ordenarSigpac() {
    this.parcelas.sort((a, b) => {
      const comparison = a.codSigpac.localeCompare(b.codSigpac);
      return this.ordenAscendenteSigpac ? comparison : -comparison;
    });
    this.ordenAscendenteSigpac = !this.ordenAscendenteSigpac;
    this.updateDisplayedParcelas();
  }

  ordenarRegadio() {
    this.parcelas.sort((a, b) => {
      const comparison = (a.esRegadio === b.esRegadio) ? 0 : a.esRegadio ? 1 : -1;
      return this.ordenAscendenteRegadio ? comparison : -comparison;
    });
    this.ordenAscendenteRegadio = !this.ordenAscendenteRegadio;
    this.updateDisplayedParcelas();
  }

}
