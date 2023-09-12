import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { of,Observable, tap, map,catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { LoginResponse } from '../interfaces/login-response.interface';
import { CheckTokenResponse } from '../interfaces/check-token.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseurl:string=environment.baseUrl;
  private http=inject(HttpClient)

  private _currentUser = signal<User|null>(null);
  private _authStatus=signal<AuthStatus>(AuthStatus.cheking);

  public currentUser=computed(()=>this._currentUser())
  public authStatus=computed(()=>this._authStatus())

  constructor() {
    this.checkAuthStatus().subscribe()
  }


  login(email:string,password:string): Observable<boolean> {
    const url=`${this.baseurl}/auth/login`
    const body={email,password}
    return this.http.post<LoginResponse>(url,body)
      .pipe(
        tap(({user,token})=>{
          this._currentUser.set(user)
          this._authStatus.set(AuthStatus.authenticathed)
          localStorage.setItem('token',token)
        })
        ,map(()=>true),
        catchError(err=>{
          return throwError(err.error.message)
        })
      )
  }

  checkAuthStatus():Observable<boolean>{
    const url=`${this.baseurl}/user/check-token`;
    const token=localStorage.getItem('token')

    if(!token){
      return of(false)
    }

    const headers= new HttpHeaders()
      .set("Authorization",`Bearer ${token}`)

    return this.http.get<CheckTokenResponse>(url,{headers})
      .pipe(
        map(({token,user})=>{
          this._currentUser.set(user)
          this._authStatus.set(AuthStatus.authenticathed)
          localStorage.setItem('token',token)
          return true
        }

        ),
        catchError(()=>{
          this._authStatus.set(AuthStatus.notAuthenticated)
          return of(false)
        })
      )
  }

}
