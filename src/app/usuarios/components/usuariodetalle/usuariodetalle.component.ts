import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { UsuariosI } from '../../models/usuarios';
import { UsuariosService } from '../../services/usuarios.service';


@Component({
  selector: 'app-usuariodetalle',
  templateUrl: './usuariodetalle.component.html',
  styleUrls: ['./usuariodetalle.component.css']
})
export class UsuariodetalleComponent implements OnInit {

  id: string | null = '';
  usuario:UsuariosI | any;

  constructor(private router:Router,
              private activatedRoute: ActivatedRoute,
              private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    this.getUsuario(this.id);
  }

  getUsuario(id:any){
    this.usuariosService.getUser(id)
            .subscribe(res =>{
              this.usuario = res as UsuariosI;
            })
  }

}
