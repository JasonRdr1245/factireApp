import { Component, OnDestroy, inject } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService=inject(AuthService)
  private router=inject(Router)

  private loginSubscription: Subscription | undefined;

  public myForm:FormGroup=this.fb.group({
    email:['jasonrch2011@hotmail.com',[Validators.required,Validators.email]],
    password:['123546',[Validators.required,Validators.minLength(6)]]
  })

  login(){


    const {email,password} = this.myForm.value
    this.authService.login(email,password).subscribe(
      {
        next: ()=> this.router.navigateByUrl('/dashboard'),
        error: (err)=>{
          Swal.fire('Error',err, 'error')
        }
      }
    )


  }

}
