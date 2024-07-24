import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  numberForm!: NgForm;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  navigateToLogin(): void {
    
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
