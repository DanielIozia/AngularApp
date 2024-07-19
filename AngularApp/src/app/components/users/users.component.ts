import { Component, OnInit } from '@angular/core';

//services
import { UserService } from '../../services/user.service';

//interaces
import { User } from '../../interfaces/User-interface';



interface Element{
  position:number,
  name:string,
  surname:string,
  weight:number,
  symbol:string
}

const ELEMENT_DATA:Element[] = [
  {position: 1, name: 'Hydrogen', surname:"filippo", weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', surname:"filippo", weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', surname:"filippo", weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', surname:"filippo", weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', surname:"filippo", weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', surname:"filippo", weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', surname:"filippo", weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', surname:"filippo", weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', surname:"filippo", weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', surname:"filippo", weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  constructor(private user:UserService){}

  private UserAPI = 'https://gorest.co.in/public/v2/users';
  private _addUser:boolean = false;
  displayedColumns: string[] = ['id','name','email','gender','status'];
  users:User[] = [];

  //chiamata al back per prendere gli utenti e mostrarli nella tabella
  ngOnInit(): void {
    this.user.getUsers(this.UserAPI).subscribe( (data:User[]) => {
      this.users = data;
    })
  }

  addUser(){
    this._addUser = true;
  }

  cancelUser(){
    this._addUser = false;
  }


}
