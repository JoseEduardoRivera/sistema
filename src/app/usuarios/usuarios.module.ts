import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { LoginComponent } from './components/login/login.component';
import { UsuariosService } from './services/usuarios.service';
import { UsuariodetalleComponent } from './components/usuariodetalle/usuariodetalle.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    UsuariosComponent,
    LoginComponent,
    UsuariodetalleComponent
  ],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    UsuariosRoutingModule
  ],
  providers:[
    NgbModule,
    UsuariosService
  ]
})
export class UsuariosModule { }
