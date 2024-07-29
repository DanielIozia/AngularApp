import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  numberForm!: NgForm;

  constructor(private auth: AuthService, private router: Router, private dialog:MatDialog) {}

  ngOnInit(): void {
  }

  navigateToLogin(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '250px',
    });
  }
}
