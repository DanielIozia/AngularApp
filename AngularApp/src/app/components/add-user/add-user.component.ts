// add-user.component.ts
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  constructor(private userService: UserService, private route: Router) {}

  private createUser = '/public/v2/users';

  onSubmit(addForm: NgForm) {
    if (addForm.valid) {
      const id = addForm.value.id;
      const name = addForm.value.name;
      const email = addForm.value.email;
      const gender = addForm.value.gender;
      const status = addForm.value.status;

      const newUser = { id, name, email, gender, status };

      console.log("nuovo utente: ", newUser);

      this.userService.addUser(this.createUser, newUser).subscribe(() => {
        this.route.navigate(['/home/users']);
      });
    }
  }

  cancelButton() {
    this.route.navigate(['/home/users']);
  }
}
