import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { User } from '../../interfaces/User-interface';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-profile-edit-dialog',
  templateUrl: './profile-edit-dialog.component.html',
  styleUrls: ['./profile-edit-dialog.component.scss']
})
export class ProfileEditDialogComponent {
  showErrorMessage: boolean = false;
  errorMessage: string | null = null;
  loading:boolean = false;


  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  isValidEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  constructor(
    public dialogRef: MatDialogRef<ProfileEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User, private userService: UserService
  ) {}

  onCancel(): void {
    this.showErrorMessage = false;
    this.dialogRef.close();
  }

  onUpdate(form: NgForm): void {
    this.loading = true;
    this.errorMessage = null;
  
    let updatedUser: User = {
      name: form.value.name,
      gender: form.value.gender,
      email: form.value.email,
      status: form.value.status
    };
  
    if (!this.isValidEmail(updatedUser.email)) {
      this.loading = false;
      this.showErrorMessage = true;
      this.errorMessage = 'Invalid Email';
      console.error(this.errorMessage);
      return;
    }
  
    if (form.valid) {
      this.showErrorMessage = false;
      this.userService.updateUser(updatedUser).subscribe(
        (data: User) => {
          this.loading = false;
          this.dialogRef.close(form.value);
        },
        error => {
          this.loading = false;
          this.showErrorMessage = true;
          this.resetFormControl(form, 'email');
          this.errorMessage = 'Email già in uso o non valida';
        }
      );
    } else {
      this.loading = false;
      this.showErrorMessage = true;
      this.errorMessage = 'Il modulo non è valido';
      console.error(this.errorMessage);
    }
  }
  

  resetFormControl(form: NgForm, controlName: string): void {
    if (form.controls[controlName]) {
      form.controls[controlName].reset();
    }
  }

}
