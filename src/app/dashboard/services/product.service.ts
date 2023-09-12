import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthStatus } from 'src/app/auth/interfaces/auth-status.enum';
import { environment } from 'src/environments/environments';
import { ProductGetResponse } from '../interfaces/products-get-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseurl: string = environment.baseUrl;
  private http = inject(HttpClient)

  private _currentProducts = signal<ProductGetResponse[] | null>(null);

  public currentProducts = computed(() => this._currentProducts())
  constructor() {
    this.checkProductStatus().subscribe()
  }

  checkProductStatus(): Observable<boolean> {
    const url = `${this.baseurl}/product`;
    const token = localStorage.getItem('token')
    if (!token) return of(false)

    const headers = new HttpHeaders()
      .set("Authorization", `Bearer ${token}`)

    return this.http.get<ProductGetResponse[]>(url, { headers })
      .pipe(
        map((products: ProductGetResponse[]) => {
          this._currentProducts.set(products)
          return true
        }),
        catchError(() => {
          return of(false)
        })
      )

  }

  createProduct(
    name: string,
    unit: string,
    unitPrice: number,
    descripcion: string,
    tipoProducto: string,
    igvIndicator: boolean,
    igv: number
  ): Observable<boolean> {
    const url=`${this.baseurl}/product`
    const body={name,unit,unitPrice,descripcion,tipoProducto,igvIndicator,igv}

    const token=localStorage.getItem('token')
    if(!token) return of(false)
    const headers=new HttpHeaders().set("Authorization",`Bearer ${token}`)

    return this.http.post(url,body,{headers})
      .pipe(
        map(
          ()=>{
            return true;
          }
        ),
        catchError((error)=>{
          console.log(error)
          return of(false)
        })
      )

  }

}
