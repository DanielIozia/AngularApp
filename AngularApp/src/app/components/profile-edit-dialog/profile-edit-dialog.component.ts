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

  constructor(
    public dialogRef: MatDialogRef<ProfileEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User, private userService: UserService
  ) {}

  onCancel(): void {
    this.showErrorMessage = false;
    this.dialogRef.close();
  }

  onUpdate(form: NgForm): void {
    this.errorMessage = null;

    let updatedUser: User = {
      name: form.value.name,
      gender: form.value.gender,
      email: form.value.email,
      status: form.value.status
    };

    console.log("Nuovo utente: ", updatedUser);

    if (form.valid) {
      this.showErrorMessage = false;
      this.userService.updateUser(updatedUser).subscribe(
        (data: User) => {
          console.log("Dati ricevuti: ", data);
          this.dialogRef.close(form.value);
        },
        error => {
            this.showErrorMessage = true;
            this.resetFormControl(form, 'email');
            console.log("Mostra messaggio di errore: ", this.showErrorMessage);
            this.errorMessage = 'Email has already been taken or is invalid';
            console.log("Errore da mostrare: ", this.errorMessage);
        }
      );
    }
  }

  private resetFormControl(form: NgForm, controlName: string): void {
    if (form.controls[controlName]) {
      form.controls[controlName].reset();
    }
  }

}
