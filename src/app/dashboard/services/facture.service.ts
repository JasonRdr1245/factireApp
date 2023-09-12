import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { FacturePostResponse } from '../interfaces/facture-post-response.interface';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private readonly baseurl: string = environment.baseUrl;
  private http = inject(HttpClient)
  constructor() { }

  createFacture(detail:string[],payMethod:string,totalPayments:number,ruc:number):Observable<FacturePostResponse>{
    const url=`${this.baseurl}/facture`
    const body={detail,payMethod,totalPayments,ruc}
    const token=localStorage.getItem('token')
    if(!token) throwError('no cargo bien el token')
    const headers=new HttpHeaders().set("Authorization",`Bearer ${token}`)
    return this.http.post<FacturePostResponse>(url,body,{headers})
      .pipe(
        catchError((err)=>{return throwError(err.error.message)})
      )
  }

}
