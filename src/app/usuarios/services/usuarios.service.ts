import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

import { UsuariosI} from '../models/usuarios';
import { TokenI} from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  AUTH_SERVER: string = 'http://localhost:3000/api/';
  authSubject = new BehaviorSubject(false);

  private token: any ='';
  public urlUsuarioIntentaAcceder:string = '';
  public changeLoginStatusSubject = new Subject<boolean>();
  public changeLoginStatus$ = this.changeLoginStatusSubject.asObservable();

  public changeUserNameSubject = new Subject<String>();
  public changeUserName$ = this.changeUserNameSubject.asObservable();

  public changeUserTypeSubject = new Subject<String>();
  public changeUserType$ = this.changeUserTypeSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  login(user: UsuariosI): Observable<TokenI>{
    return this.httpClient.post<TokenI>(this.AUTH_SERVER+'login',user)
    .pipe(tap(
      ((res)=>{
        if (res.success){
          var decoded:any = jwt_decode(res.token);
          //guardar token en localstorage
          var userName = decoded.user.name;
          this.changeUserNameSubject.next(userName);
          this.saveToken(res.token, decoded.exp);
          this.changeLoginStatusSubject.next(true);

          //Emitir el tipo de usuario a la variable global en memoria
          var userType = decoded.user.tipo;
          this.changeUserTypeSubject.next(userType);
        }
        return this.token;
      })
    ));
  }


  logout():void {
    this.token = '';
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
    this.changeLoginStatusSubject.next(false);
  }

  private saveToken(token: any, expiresIn:any):void{
    localStorage.setItem("ACCESS_TOKEN", token);
    localStorage.setItem("EXPIRES_IN", expiresIn);
    this.token = token;
  }

private getToken():string{
  if(this.token){
    this.token = localStorage.getItem("ACCESS_TOKEN");
  }
  return this.token;
}

isLoggedIn(url:string):boolean{
  const isLogged = localStorage.getItem("ACCESS_TOKEN");
  if (!isLogged){
    this.urlUsuarioIntentaAcceder = url;
    return false;
  }
  return true;
}

getUsers(){
  return this.httpClient.get(
    this.AUTH_SERVER+'users',
    {
      headers: new HttpHeaders({'Authorization': 'token-auth'+this.getToken()})
    }
  );
}

getUser(id:string){
  return this.httpClient.get(
    this.AUTH_SERVER+'users/'+id,
    {
      headers: new HttpHeaders({'Authorization': 'token-auth'+this.getToken()})
    }
  );
}

addUser(usuario: UsuariosI){
  return this.httpClient.post(
    this.AUTH_SERVER+'users',usuario,{
      headers: new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization':'token-auth'+this.getToken()
      })
    }
  );
}

removeUser(id:string){
  return this.httpClient.delete(
    this.AUTH_SERVER+'users/'+id,
    {
      headers: new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization':'token-auth'+this.getToken()
      })
    }
  )
}

updateUser(usuario:UsuariosI){
  return this.httpClient.put(
    this.AUTH_SERVER+'users/'+usuario._id,
    {
      headers: new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization':'token-auth'+this.getToken()
      })
    }
  )
}

}


