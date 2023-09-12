import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ProductsComponent } from './pages/products/products.component';
import { CreateProductsComponent } from './pages/create-products/create-products.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FacturationComponent } from './pages/facturation/facturation.component';


@NgModule({
  declarations: [
    ProductsComponent,
    CreateProductsComponent,
    FacturationComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DashboardRoutingModule
  ],
  providers:[DatePipe]

})
export class DashboardModule { }
