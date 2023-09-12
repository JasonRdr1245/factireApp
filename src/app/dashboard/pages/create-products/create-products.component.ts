import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { EnumValidator } from '../../validators/enum.validator';
import { TipoProducto, Unit } from '../../interfaces/products-get-response.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.component.html',
  styleUrls: ['./create-products.component.css']
})
export class CreateProductsComponent {
  private productService=inject(ProductService)
  private fb=inject(FormBuilder)
  private router=inject(Router)


  public myForm:FormGroup=this.fb.group({
    name:['',[Validators.required]],
    unit:['',[Validators.required,EnumValidator(Unit)]],
    unitPrice:["",[Validators.required]],
    descripcion:['',[Validators.required]],
    tipoProducto:['',[Validators.required,EnumValidator(TipoProducto)]],
    igvIndicator:[true,[Validators.required]],
    igv:['',[Validators.required]],
  })

  private productStatus:null|any;

  create(){
    const {name,unit,unitPrice,descripcion,tipoProducto,igvIndicator,igv}=this.myForm.value

    this.productService.createProduct(name,unit,Number(unitPrice),descripcion,tipoProducto,igvIndicator,Number(igv)).subscribe(
      {
        next:()=>{
          this.productStatus=this.productService.checkProductStatus().subscribe()
          this.router.navigateByUrl('/dashboard/products')
        },
        error:(error)=>{
          Swal.fire('Error',error, 'error')

        }
      }
    )



  }

}
