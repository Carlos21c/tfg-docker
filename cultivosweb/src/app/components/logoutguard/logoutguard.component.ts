import { Component, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PropietarioService } from '../../services/propietario.service';

@Injectable({
  providedIn: 'root' 
})

@Component({
  selector: 'app-logoutguard',
  standalone: true,
  imports: [],
  templateUrl: './logoutguard.component.html',
  styleUrl: './logoutguard.component.css'
})
export class LogoutguardComponent implements CanActivate {

  constructor(private propietarioService: PropietarioService, private router: Router) {}

  canActivate(): boolean {
    this.propietarioService.logout();
    return false;
  }
}
