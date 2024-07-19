import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private auth:AuthService, private router:Router){}

  navigateToLogin():void{
    this.auth.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

}
