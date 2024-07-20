import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User-interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'gender', 'status', 'delete'];
  _addUser: boolean = false;
  quanti: number = 0;
  selectedNumber: number = 0;
  isLoading: boolean = true;
  filterValue: string = '';
  max: number = 0;

  private UserAPI = 'https://gorest.co.in/public/v2/users';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();    
  }

  addUser() {
    this.router.navigate(['/home/addUser']);
  }

  deleteUser() {
    console.log('sto provando ad eliminare');
  }

  applyFilter() {
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(this.filterValue.toLowerCase()) ||
      user.email.toLowerCase().includes(this.filterValue.toLowerCase()) 
    );

    console.log("Users filtered: ", this.filteredUsers);
    this.updateDisplayedUsers();
  }

  clearFilter() {
    this.filterValue = '';
    this.filteredUsers = this.users;
    this.updateDisplayedUsers();
  }

  updateDisplayedUsers() {
    if (this.selectedNumber > 0) {
      this.quanti = Math.min(this.selectedNumber, this.filteredUsers.length);
    } else {
      this.quanti = this.filteredUsers.length;
    }
  }

  goToDetail(id:number){
    return this.router.navigate([`/home/users/${id}`]);
  }

  private loadUsers() {
    this.userService.getUsers(this.UserAPI).subscribe((data: User[]) => {
      this.users = data;
      this.filteredUsers = data;
      this.max = this.users.length;
      this.selectedNumber = this.users.length; // Imposta selectedNumber a users.length
      this.updateDisplayedUsers();
      this.isLoading = false;
    });
  }
}
