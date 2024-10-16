import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { PropietarioService } from '../../services/propietario.service';
import { Propietario } from '../../model/propietario';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{

  private router = inject(Router);
  private propietarioService = inject(PropietarioService);
  private dniPropietario: string = '';
  private dialog = inject(MatDialog);
  private oldPass: string = '';

  propietario: Propietario | null = null;

  constructor(){}

  ngOnInit(): void {
    this.dniPropietario = this.propietarioService.getDni() || '';
    this.oldPass = this.propietarioService.getPass() || '';
    if(this.dniPropietario){      
      this.propietarioService.getByDni(this.dniPropietario).subscribe(data => {
        this.propietario = data
      }); 
    }   
  }

  editarPerfil(){
    this.router.navigate(['registro', this.dniPropietario, this.oldPass]);
  }
  eliminarPerfil(){    
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.propietarioService.delete(this.dniPropietario).subscribe((eliminado: Boolean) => {
          if (eliminado) {
            console.log('Eliminada el usuario con dni ' + this.dniPropietario);
            this.propietarioService.logout();
          } else {
            console.log('No se ha podido eliminar el usuario ' + this.dniPropietario);
          }
        });
      } else {
        console.log('Acción cancelada');
      }
    });
  }
}
