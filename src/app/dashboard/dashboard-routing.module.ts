import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { ProductsComponent } from './pages/products/products.component';
import { CreateProductsComponent } from './pages/create-products/create-products.component';
import { FacturationComponent } from './pages/facturation/facturation.component';

const routes: Routes = [
  {
    path:'',
    component:DashboardLayoutComponent,
    children:[
      {
        path:'products',
        component:ProductsComponent
      },
      {
        path:'create-products',
        component:CreateProductsComponent
      },
      {
        path:'facture',
        component:FacturationComponent
      },
      {
        path:'**',
        redirectTo:'products'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
