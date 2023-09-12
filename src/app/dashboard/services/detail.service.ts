import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { DetailPostResponse } from '../interfaces/details-post-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  constructor() { }
  private readonly baseurl: string = environment.baseUrl;
  private http = inject(HttpClient)


  createDetail(product:string,amount:number):Observable<DetailPostResponse>{
    const url=`${this.baseurl}/detail`
    const body={product,amount}
    const token=localStorage.getItem('token')
    if(!token) return throwError('Error al esperar el token')
    const headers=new HttpHeaders().set("Authorization",`Bearer ${token}`)
    return this.http.post<DetailPostResponse>(url,body,{headers})
      .pipe(
        catchError((err)=>{
          return throwError(err.error.message)
        })
      )
  }

}
