import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PropietarioService } from '../../services/propietario.service';

@Injectable({
  providedIn: 'root' 
})

@Component({
  selector: 'app-authguard',
  standalone: true,
  imports: [],
  templateUrl: './authguard.component.html',
  styleUrl: './authguard.component.css'
})
export class AuthguardComponent {

  constructor(private propietarioService: PropietarioService, private router: Router) {}

  canActivate(): boolean {
    if (this.propietarioService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
