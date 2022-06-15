import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { CanActivateGuard } from '../can-activate.guard';

const routes: Routes = [
  {path: 'empleados', component: EmpleadosComponent, canActivate: [CanActivateGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadosRoutingModule { }
