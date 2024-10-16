import { Component, inject } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PropietarioService } from '../../services/propietario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {

  email: string = '';
  password: string = '';
  loginError: boolean = false;

  private propietarioService = inject(PropietarioService) ;
  private router = inject(Router);

  constructor(){}


  login(): void {
    this.propietarioService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['parcelas']),
      error: (err) => {
        console.error('Login failed', err);
        this.loginError = true;
      }
    });
  }

  registro(){this.router.navigate(['registro'])}
}
