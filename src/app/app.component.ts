import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces/auth-status.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private authService=inject(AuthService)
  public finishedAuthCheck =computed<boolean>(()=>{
    if(this.authService.authStatus()===AuthStatus.cheking){
      return false
    }
    return true
  })



}
