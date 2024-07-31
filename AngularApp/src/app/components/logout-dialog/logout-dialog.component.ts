import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrl: './logout-dialog.component.scss'
})
export class LogoutDialogComponent {

  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LogoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
    private auth:AuthService,
    private router:Router
  ) {}


  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.loading = true;
    setTimeout(() => {
        this.auth.logout();
        this.router.navigate(['/login']);
        this.dialogRef.close(true);
        this.loading = false;
    }, 0);
}

}
