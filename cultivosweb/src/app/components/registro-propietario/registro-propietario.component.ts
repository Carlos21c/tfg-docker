import { Component, OnInit, inject } from '@angular/core';
import { PropietarioService } from '../../services/propietario.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

export function passwordMatchValidator(): ValidatorFn{
  return (control: AbstractControl): {[key: string]: any} | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPass');
    return password && confirmPassword && password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;  
  };
};


@Component({
  selector: 'app-registro-propietario',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registro-propietario.component.html',
  styleUrl: './registro-propietario.component.css'
})

export class RegistroPropietarioComponent implements OnInit{
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private propietarioService = inject(PropietarioService);
  private dniPropietario = '';
  private oldEmail = '';
  private oldPass = '';

  private patronPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  private patronTelf = /^[0-9]{9}$/;
  private patronDni = /^[0-9]{8}[A-Z]$/;

  form = this.fb.group({    
    dniPropietario: ['', [Validators.required, Validators.pattern(this.patronDni)]],
    nombre: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: [0 , [Validators.required, Validators.pattern(this.patronTelf)]],
    password: ['', [Validators.required, Validators.pattern(this.patronPass)]],
    confirmPass: ['', [Validators.required]]
  }, {validators: passwordMatchValidator()});

  isEditMode = false; 

  constructor(){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const dniPropietario = params['dni'];
      const pass = params['oldPass'];
      if (dniPropietario) {
        this.oldPass = pass; 
        this.isEditMode = true;
        this.loadData(dniPropietario);
      }
    });
  }
  

  loadData(dniPropietario: any):void{
    this.propietarioService.getByDni(dniPropietario).subscribe(data => {
      this.dniPropietario = data.dniPropietario;
      this.oldEmail = data.email;
      this.form.patchValue({
        dniPropietario: data.dniPropietario,
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        password: this.oldPass,
        confirmPass: this.oldPass
      })      
    })
  }

  create(){    
    if(this.form.value.password === this.form.value.confirmPass){
      if((this.form.value.nombre==='') || (this.form.value.email==='') || (this.form.value.dniPropietario==='') || (this.form.value.password==='') && !this.isEditMode){ 
        console.log('Algún campo de nombre, email, dni o password está vacío'); 
        return ;
      }      
      const propietario = this.form.value;
      if(this.isEditMode){
        const email = this.form.value.email;
        const dni = this.form.value.dniPropietario;
        if (email) {
          this.propietarioService.getByEmail(email).subscribe(data => {
            if (data != null && email != this.oldEmail) {
              alert('Este email ya está registrado en la base de datos');
            } else {  
              if(dni){
                this.propietarioService.getByDni(dni).subscribe(data => {
                  if(data != null && dni != this.dniPropietario){
                    alert('Un usuario ya está registrado con este DNI');
                  }else{
                    this.propietarioService.update(this.dniPropietario, propietario).subscribe(()=>{
                      this.router.navigate(['perfil']);
                    })
                  }
                });
              }     
            }
          });
        }
      }else{
        const email = this.form.value.email;
        const dni = this.form.value.dniPropietario;
        if (email) {
          this.propietarioService.getByEmail(email).subscribe(data => {
            if (data != null) {
              alert('Este email ya está registrado en la base de datos');
            } else {  
              if(dni){
                this.propietarioService.getByDni(dni).subscribe(data => {
                  if(data != null){
                    alert('Un usuario ya está registrado con este DNI');
                  }else{
                    this.propietarioService.create(propietario).subscribe(() => {
                      this.router.navigate(['']);
                    });
                  }
                });
              }     
            }
          });
        }
     }
    }else{
      console.log('Las contraseñas no coinciden');
      return;
    }
  }
}
