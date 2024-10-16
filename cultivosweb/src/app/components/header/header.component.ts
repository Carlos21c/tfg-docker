import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PropietarioService } from '../../services/propietario.service';
import { FormstateService } from '../../services/formstate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private router = inject(Router);
  private propietarioService = inject(PropietarioService);
  private formStateService = inject(FormstateService);

  menuVisible = false;
 
  
  parcelas(){
    this.formStateService.clearFormState();
    this.router.navigate(['parcelas']);
    this.toggleMenu();
  }
  cultivos(){
    this.formStateService.clearFormState();
    this.router.navigate(['cultivos']);
    this.toggleMenu();
  }
  comparador(){
    this.formStateService.clearFormState();
    this.router.navigate(['comparador']);
    this.toggleMenu();
  }
  perfil(){
    this.formStateService.clearFormState();
    this.router.navigate(['perfil']);
    this.toggleMenu();
  }
  logout(){
    this.formStateService.clearFormState();
    this.propietarioService.logout();
    this.toggleMenu();
  }

  toggleMenu(){
    this.menuVisible = !this.menuVisible;
  }
}
