import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User-interface';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'gender', 'status'];
  _addUser: boolean = false;
  quanti: number = 0;
  filterValue: string = '';
  isLoading: boolean = true;
  currentPage: number = 1; // Pagina corrente
  totalPages: number = 0; // Numero totale di pagine
  oltre:boolean = true;
  primaPagina:boolean;

  constructor(private userService: UserService, private router: Router, private auth:AuthService) {
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


  goToDetail(id: number) {
    return this.router.navigate([`/home/users/${id}`]);
  }

  private loadUsers() {
    

    this.userService.getUsers(this.auth.getToken(), this.currentPage).subscribe( (data: User[]) => {
      this.users = data;
      this.filteredUsers = data;  
      this.isLoading = false;
    });
  }

  previousPage() {
    this.clearFilter();
    if(this.currentPage == 2){
      this.primaPagina = true;
    }
    if (this.currentPage != 1) {
      const token = localStorage.getItem('authToken');
      this.currentPage--;
      if(!this.oltre){
        this.oltre = true;
      }
      this.userService.getUsers(token, this.currentPage).subscribe ( (data:User[]) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
       
    })
      
    }
    else{
      this.primaPagina = false;
    }
  }

  nextPage() {
    this.clearFilter();
    const token = localStorage.getItem('authToken');
    this.userService.getUsers(token, this.currentPage+1).subscribe ( (data:User[]) => {
      if(data.length != 0){
        this.primaPagina = false;
        this.oltre = true;
        this.users = data;
        this.currentPage++;
        this.filteredUsers = data;
        this.isLoading = false;
        }
        else
        this.oltre = false; 
    })
    /* devo vedere come sistemare l'ultima pagina
    this.userService.getUsers(token,this.currentPage+1).subscribe ( (data:User[]) => {
      this.oltre = (data.length == 0);
      console.log("oltre: ",this.oltre);
    })*/
  
    
    
  }
}
