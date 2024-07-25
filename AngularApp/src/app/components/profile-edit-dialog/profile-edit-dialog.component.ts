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
  constructor(
    public dialogRef: MatDialogRef<ProfileEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User, private user:UserService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(form: NgForm): void {

    //devo controllare che l'email non esiste già
    //forme mi dice email already been taken 
    let updatedUser:User = {
      name:form.value.name,
      gender:form.value.gender,
      email:form.value.email,
      status:form.value.status
    }
    console.log("Nuovo utente: ", updatedUser);
    if (form.valid) {
      this.user.updateUser(updatedUser).subscribe (data => {
        console.log("Dati ricevuti: ",data);
      })
      this.dialogRef.close(form.value);
    }
  }
}
