import { Component, OnInit, computed, effect, inject, OnDestroy } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductGetResponse } from '../../interfaces/products-get-response.interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent{

  private productLecture:null|any;



  private productService=inject(ProductService)
  public products=computed<ProductGetResponse[]|null>(()=>{return this.productService.currentProducts()})

  public productsChangeEffect = effect(()=>{
    console.log(this.products())
  })


}
