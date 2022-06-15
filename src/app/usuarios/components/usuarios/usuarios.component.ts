import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';
import { UsuariosI } from '../../models/usuarios';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, Form} from '@angular/forms';
import { MustMatch } from '../../helpers/must-match.calidator';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  closeResult: string ='';
  public usuarios:any = [];
  public registerForm: FormGroup | any;
  public updateForm: FormGroup | any;
  public submited = false;
  public user:UsuariosI | any;

  constructor(private usuariosService: UsuariosService,
    private router: Router,
    public modal: NgbModal,
    public modalDelete: NgbModal,
    public modalUpdate: NgbModal,
    private formBuilderUpdate: FormBuilder,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]],
      passwordconfirm: ['', Validators.required],
      tipo: ['', Validators.required]
    },
    {
      validator: MustMatch('password', 'passwordconfirm')
    });

    this.updateForm = this.formBuilderUpdate.group({
      _id:[''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]],
      tipo: ['', Validators.required]
    });
    this.getUsuarios();
  }

  get fields(){ return this.registerForm?.controls}

  getUsuarios(){
    this.usuariosService.getUsers()
      .subscribe(response =>{
        console.log('llamada a getUsuarios');
        this.usuarios = response as UsuariosI;
    })
  }

  mostrarUsuario(_id: number){
    this.router.navigate(['usuarios/'+_id])
  }

  open(content:any){
    this.registerForm.reset();
    this.modal.open(content, {ariaLabelledBy:'modal-basic-title'}).result.then((result)=>{
      this.closeResult = `Closed with: ${result}`;
    }, (reason)=>{
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason:any):string{
    if(reason===ModalDismissReasons.ESC){
      return ' by pressing ESC';
    }else if (reason ===ModalDismissReasons.BACKDROP_CLICK){
      return 'by clicking on a backdroup';
    }else{
      return `with: ${reason}`;
    }
  }

  onSubmit(){
    this.submited = true;
    if(this.registerForm.controls["name"].status === "INVALID" ||
    this.registerForm.controls["email"].status === "INVALID" ||
    this.registerForm.controls["password"].status === "INVALID" ||
    this.registerForm.controls["passwordconfirm"].status === "INVALID"){
      return;
    }
    console.log(this.registerForm.value);

    let usuario:UsuariosI = {
      _id:0,
      name:this.registerForm.value.name,
      email:this.registerForm.value.email,
      password: this.registerForm.value.password,
      tipo: this.registerForm.value.tipo
    }

    this.usuariosService.addUser(usuario).subscribe(res=>{
      if(res.hasOwnProperty('message')){
        let error:any = res;
        if(error.message =='Error user Exist'){
          Swal.fire({
            icon:'error',
            title:'Error',
            text:'Error, el email ya esta en uso, utilice otro',
            confirmButtonColor:'#A1260C'
          });
          return;
        }
      }
      Swal.fire({
        icon:'success',
        title:'Registro Exitoso',
        text:'Usuario registrado de manera exitosa',
        confirmButtonColor:'#3FEE0A'
      });
        this.getUsuarios();
        this.registerForm.reset();
        this.modal.dismissAll();
      
    })
  }

  abrirModalEliminarUsuario(id:string,modalname:any){
    this.usuariosService.getUser(id).subscribe(res=>{
      this.user = res as UsuariosI;
    })
    this.modalDelete.open(modalname, {size:'sm'}).result.then((res)=>{
      this.closeResult = `Closed with: ${res}`;
    },(reason)=>{
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteUser(id:string){
    console.log(id);
    this.usuariosService.removeUser(id).subscribe(res=>{
      this.getUsuarios();
      this.modalDelete.dismissAll();
      Swal.fire({
        icon:'success',
        title:'Eliminacion Exitosa',
        text:'Usuario eliminado de manera exitosa',
        confirmButtonColor:'#3FEE0A'
      });
    })
  }

  modificarUsuario(usuario:UsuariosI,modal:any){
    this.updateForm = this.formBuilderUpdate.group({
      _id: [usuario._id],
      name:[usuario.name,Validators.required],
      email:[usuario.email,[Validators.required, Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]],
      tipo:[usuario.tipo, Validators.required]
    });
    this.modal.open(modal,{size:'sm'}).result.then ((result)=>{
      this.closeResult = `Closed with: ${result}`;
    },(reason)=>{
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    })
  }

  updateSubmit(){
    if(this.registerForm.controls["name"].status === "INVALID" ||
    this.registerForm.controls["email"].status === "INVALID" ||
    this.registerForm.controls["password"].status === "INVALID"){
      return;
    }
    console.log(this.updateForm.value);
    let usuario:UsuariosI ={
      _id: this.updateForm.value._id,
      name: this.updateForm.value.name,
      email: this.updateForm.value.email,
      password: this.updateForm.value.password,
      tipo: this.updateForm.value.tipo
    }

    this.usuariosService.updateUser(usuario).subscribe(res=>{
      console.log(res);
      if(res.hasOwnProperty('message')){
        let error: any =res;
        if(error.message == 'Error al actualizar el usuario'){
          Swal.fire({
            icon:'error',
            title:'Error',
            text:'Error al actualizar el usuario',
            confirmButtonColor:'#A1260C'
          });
          return;
        }
      }
      Swal.fire({
        icon:'success',
        title:'Actualizacion exitosa',
        text:'Usuario actualizado de manera exitosa',
        confirmButtonColor:'#3FEE0A'
      });
      this.getUsuarios();
      this.registerForm.reset();
      this.modal.dismissAll();
    });

  }


}
