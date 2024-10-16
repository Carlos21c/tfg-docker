import { Routes } from '@angular/router';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { RegistroPropietarioComponent } from './components/registro-propietario/registro-propietario.component';
import { ListaParcelasComponent } from './components/lista-parcelas/lista-parcelas.component';
import { ParcelaComponent } from './components/parcela/parcela.component';
import { CultivoComponent } from './components/cultivo/cultivo.component';
import { ListaCultivosComponent } from './components/lista-cultivos/lista-cultivos.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AuthguardComponent } from './components/authguard/authguard.component';
import { ComparadorComponent } from './components/comparador/comparador.component';
import { ParcelaDataComponent } from './components/parcela-data/parcela-data.component';
import { CultivoDataComponent } from './components/cultivo-data/cultivo-data.component';
import { CultivoFileComponent } from './components/cultivo-file/cultivo-file.component';
import { LogoutguardComponent } from './components/logoutguard/logoutguard.component';
import { ListaComparativaComponent } from './components/lista-comparativa/lista-comparativa.component';
import { ResultadoComparativaComponent } from './components/resultado-comparativa/resultado-comparativa.component';



export const routes: Routes = [
    {path : "login", component: InicioSesionComponent},
    {path : "registro", component: RegistroPropietarioComponent},    
    {path : "parcelas", component: ListaParcelasComponent, canActivate:[AuthguardComponent]},
    {path : "cultivos", component: ListaCultivosComponent, canActivate:[AuthguardComponent]},
    {path : "addParcela", component: ParcelaComponent, canActivate:[AuthguardComponent]},
    {path : "editParcela/:codSigpac", component: ParcelaComponent, canActivate:[AuthguardComponent]},
    {path : "addCultivo", component: CultivoComponent, canActivate:[AuthguardComponent]},
    {path : "editCultivo/:codSigpac/:year", component: CultivoComponent, canActivate:[AuthguardComponent]},
    {path : "perfil", component: PerfilComponent, canActivate:[AuthguardComponent]},
    {path : "registro/:dni/:oldPass", component: RegistroPropietarioComponent, canActivate:[AuthguardComponent]},
    {path : "comparador", component: ComparadorComponent, canActivate:[AuthguardComponent]},
    {path : "parcela/:codSigpac", component: ParcelaDataComponent, canActivate:[AuthguardComponent]},
    {path : "cultivo/:codSigpac/:year", component: CultivoDataComponent, canActivate:[AuthguardComponent]},
    {path : "file/:codSigpac/:year", component: CultivoFileComponent, canActivate:[AuthguardComponent]},
    {path : "comparador/:codSigpac/:year", component: ComparadorComponent, canActivate:[AuthguardComponent]},
    {path : "list-comparator/:campos", component: ListaComparativaComponent, canActivate:[AuthguardComponent]},
    {path : "resultadoComparativa/:datos/:marcarValores", component: ResultadoComparativaComponent, canActivate:[AuthguardComponent]},
    {path : "**", redirectTo: "login"}
];
