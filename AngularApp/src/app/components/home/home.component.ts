import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  numberForm!:NgForm;
  number:number = 0;

  @Output() valueForm = new EventEmitter();

  constructor(private auth:AuthService, private router:Router, private dataService:DataService){}



  navigateToLogin():void{
    this.auth.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  formValue() {
    this.dataService.changeNumber(this.number);
  }



}
