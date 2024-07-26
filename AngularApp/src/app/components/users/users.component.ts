import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User-interface';
import { AuthService } from '../../services/auth/auth.service';
//componente di dialogo (delete confirm)
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  displayedColumns: string[] = ['index','name', 'email', 'status','delete'];
  filterValue: string = '';
  isLoading: boolean = true;
  currentPage: number = 1; 
  oltre:boolean = true;
  primaPagina:boolean;
  deletingUserId: number | null = null;
  userID:number = this.auth.getId();
  usersPerPage: number = 10; // initial value user per page
  usersPerPageOptions: number[] = [10, 25, 50, 75, 100];




  constructor(private userService: UserService, private router: Router, private auth:AuthService, public dialog: MatDialog) {
    this.currentPage = 1;
    this.primaPagina = true;
  }

  goToProfile(){
    this.router.navigate(['/home/profile']);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  applyFilter() {
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(this.filterValue.toLowerCase()) ||
      user.email.toLowerCase().includes(this.filterValue.toLowerCase())
    );
  }

  clearFilter() {
    this.filterValue = '';
    this.filteredUsers = this.users;
  }


  goToDetail(id: number) {
    return this.router.navigate([`/home/users/${id}`]);
  }


  private loadUsers() {
    this.isLoading = true;
    this.userService.getUsers(this.auth.getToken(), this.currentPage, this.usersPerPage).subscribe(
      (data: User[]) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      error => {
        console.error('Errore durante il caricamento degli utenti:', error);
        this.isLoading = false;
      }
    );
  }
  
  

  previousPage() {
    this.clearFilter();
    if (this.currentPage == 2) {
      this.primaPagina = true;
    }
    if (this.currentPage != 1) {
      const token = localStorage.getItem('authToken');
      this.currentPage--;
      if (!this.oltre) {
        this.oltre = true;
      }
      this.userService.getUsers(token, this.currentPage, this.usersPerPage).subscribe((data: User[]) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      });
    } else {
      this.primaPagina = false;
    }
  }
  

  nextPage() {
    this.clearFilter();
    const token = localStorage.getItem('authToken');
    this.userService.getUsers(token, this.currentPage + 1, this.usersPerPage).subscribe((data: User[]) => {
      if (data.length != 0) {
        this.primaPagina = false;
        this.oltre = true;
        this.users = data;
        this.currentPage++;
        this.filteredUsers = data;
        this.isLoading = false;
      } else {
        this.oltre = false;
      }
    });
  }
  //funzione per gestire il cambiamento del numero di utenti per pagina
  onUsersPerPageChange(event: any) {
    this.usersPerPage = event.value;
    this.currentPage = 1; // Reimposta alla prima pagina quando cambia il numero di utenti per pagina
    this.loadUsers();
  }

  deleteUser(id: number, name: string) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '250px',
      data: { name }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletingUserId = id;
        this.userService.deleteUser(id).subscribe(
          () => {
            this.loadUsers();
            this.deletingUserId = null;
          },
          error => {
            console.error('Errore durante l\'eliminazione:', error);
            this.deletingUserId = null;
          }
        );
      }
    });
  } 
}
