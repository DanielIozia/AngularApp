import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User-interface';
import { DataService } from '../../services/data-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'gender', 'status', 'delete'];
  _addUser: boolean = false;
  quanti: number = 0;
  selectedNumber: number = 0;
  isLoading: boolean = true;

  private UserAPI = 'https://gorest.co.in/public/v2/users';

  constructor(private userService: UserService, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.dataService.currentNumber.subscribe( number => {
      this.selectedNumber = number;
      this.updateDisplayedUsers();
    });
  }

  addUser() {
    this.router.navigate(['/home/addUser']);
  }

  cancelUser() {
    this._addUser = false;
  }

  deleteUser() {
    console.log('sto provando ad eliminare');
  }

  receiveFormValue(e: Event) {
    console.log(e);
  }

  

  private updateDisplayedUsers() {
    if (this.selectedNumber >= 0) {
      this.quanti = Math.min(this.selectedNumber, this.users.length);
    } 
    else {
      this.quanti = this.users.length;
    }
  }

  private loadUsers() {
    this.userService.getUsers(this.UserAPI).subscribe( (data: User[]) => {
      this.users = data;
      this.updateDisplayedUsers();
      this.isLoading = false;
      this.dataService.changeUsersLength(this.users.length); // Aggiorna la lunghezza dell'array users
      this.dataService.changeNumber(this.users.length); // Imposta il numero di utenti di default
    });
  }
}
