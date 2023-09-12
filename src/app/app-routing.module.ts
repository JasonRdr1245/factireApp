import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAthenticatedGuard } from './auth/guards/is-athenticated.guard';

const routes: Routes = [
  {
    path:'auth',
    loadChildren:()=>import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path:'dashboard',
    canActivate:[isAthenticatedGuard],
    loadChildren:()=>import('./dashboard/dashboard.module').then(m=>m.DashboardModule)
  },
  {
    path:'**',
    redirectTo:'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
