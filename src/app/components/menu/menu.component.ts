import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/usuarios/services/usuarios.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  usuarioLogueado: boolean = false;
  userName:string = '';
  userType =0;
  
  constructor(public usuariosService: UsuariosService){

  }

  ngOnInit(): void {
    this.usuarioLogueado = this.usuariosService.isLoggedIn('');
    this.usuariosService.changeLoginStatus$.subscribe((loggedStatus:boolean)=>{
      this.usuarioLogueado = loggedStatus;
    })
    this.usuariosService.changeUserName$.subscribe((userName:any)=>{
      this.userName = userName;
    })

    this.usuariosService.changeUserType$.subscribe((userType:any)=>{
      this.userType = parseInt(userType);
    })
  }//ngOnInit

  logout():void{
    this.usuariosService.logout();
  }
}
