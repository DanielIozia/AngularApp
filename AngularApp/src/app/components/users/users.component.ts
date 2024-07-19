import { Component, OnInit } from '@angular/core';
import { AddUserComponent } from '../add-user/add-user.component';

//services
import { UserService } from '../../services/user.service';

//interaces
import { User } from '../../interfaces/User-interface';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  constructor(private user:UserService, private router:Router){}

  private UserAPI = 'https://gorest.co.in/public/v2/users';
  _addUser:boolean = false;
  displayedColumns: string[] = ['id','name','email','gender','status','delete'];
  users:User[] = [];

  //chiamata al back per prendere gli utenti e mostrarli nella tabella
  ngOnInit(): void {
    this.user.getUsers(this.UserAPI).subscribe( (data:User[]) => {
      this.users = data;
    })
  }

  addUser(){
    this.router.navigate(['/home/addUser']);
    //chiamata this.user.addUser()

    }
  

  cancelUser(){
    this._addUser = false;
  }

  deleteUser(){
    console.log("sto provando ad eliminare");
  }


}
