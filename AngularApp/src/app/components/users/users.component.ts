  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { UserService } from '../../services/user.service';
  import { User } from '../../interfaces/User-interface';
  import { AuthService } from '../../services/auth/auth.service';
  import { MatDialog } from '@angular/material/dialog';
  import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';
  import { NgForm } from '@angular/forms';

  @Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
  })
  export class UsersComponent implements OnInit {
    users: User[] = [];
    filteredUsers: User[] = [];
    displayedColumns: string[] = ['index', 'name', 'email', 'status', 'delete'];
    filterValue: string = '';
    isLoading: boolean = true;
    currentPage: number = 1; 
    oltre: boolean = true;
    primaPagina: boolean;
    deletingUserId: number | null = null;
    userID: number = this.auth.getId();
    usersPerPage: number = 10; // initial value user per page
    usersPerPageOptions: number[] = [10, 25, 50, 75, 100];

    // New user
    creatingNewUser: boolean = false;
    creatingUser: boolean = false;
    showtextError: boolean = false;
    textError: string = '';
    emailError: string | null = null;
    emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor(
      private userService: UserService, 
      private router: Router, 
      private auth: AuthService, 
      public dialog: MatDialog
    ) {
      this.currentPage = 1;
      this.primaPagina = true;
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

    goToProfile() {
      this.router.navigate(['/home/profile']);
    }

    goToDetail(id: number) {
      this.router.navigate([`/home/users/${id}`]);
    }

    isValidEmail(email: string): boolean {
      return this.emailRegex.test(email);
    }

    loadUsers() {
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
        }, error => {
          console.error('Errore durante il caricamento degli utenti:', error);
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
      }, error => {
        console.error('Errore durante il caricamento degli utenti:', error);
        this.isLoading = false;
      });
    }

    // funzione per gestire il cambiamento del numero di utenti per pagina
    onUsersPerPageChange(event: any) {
      this.usersPerPage = event.value;
      this.currentPage = 1; // Reimposta alla prima pagina quando cambia il numero di utenti per pagina
      this.loadUsers();
    }

    // Funzioni per la creazione di nuovi utenti
    createUser() {
      this.creatingUser = true;
    }

    cancelNewUser() {
      this.creatingUser = false;
    }

    submitNewUserPost(form: NgForm) {
      this.creatingNewUser = true;

      const newUser: User = {
        name: form.value.name,
        email: form.value.email,
        gender: form.value.gender,
        status: form.value.status
      };

      //aggiungere qui il controllo dell'email
      if(this.isValidEmail(newUser.email)){
        this.userService.createUser(newUser, this.auth.getToken()!).subscribe((u: User) => {
          this.creatingNewUser = false;
          this.creatingUser = false;
          form.reset();
          this.loadUsers();
        }, error => {
          this.handleError(error, form);
        });
      }
      else{
        this.creatingNewUser = false;
        console.log("SONO QUI DENTRO")
        this.emailError = "Email is invalid"
        this.resetFormControl(form, 'email');
        return;
      }

      
    }

    private handleError(error: any, form: NgForm): void {
      this.isLoading = false;
      this.creatingNewUser = false;

      if (error.status === 422) {
        const errorMessages = error.error as { field: string; message: string }[];
        errorMessages.forEach(err => {
          if (err.field === 'email') {
            this.emailError = "Email " + err.message;
            this.resetFormControl(form, 'email');
          }
        });
      } else {
        console.error('Error creating user:', error);
      }
    }

    private resetFormControl(form: NgForm, controlName: string): void {
      if (form.controls[controlName]) {
        form.controls[controlName].reset();
      }
    }

    // Funzione per eliminare l'utente
    deleteUser(id: number, name: string): void {
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '300px',
        data: { name: name, id: id }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadUsers();
          console.log(`L'utente ${name} è stato eliminato con successo`);
        } else {
          console.log(`L'utente ${name} non è stato eliminato`);
        }
      }, error => {
        console.log("Errore nell'eliminazione:", error);
      });
    }
  }
