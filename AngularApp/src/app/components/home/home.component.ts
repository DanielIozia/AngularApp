import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DataService } from '../../services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  numberForm!: NgForm;
  number: number | any = null;
  max: number = 0;

  @Output() valueForm = new EventEmitter();

  constructor(private auth: AuthService, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.currentUsersLength.subscribe( length => {
      this.max = length;
    });
  }

  navigateToLogin(): void {
    this.auth.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  formValue() {
    this.dataService.changeNumber(this.number);
  }
}
