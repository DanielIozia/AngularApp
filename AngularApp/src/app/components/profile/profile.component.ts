import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/User-interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  constructor(private user:UserService,private auth:AuthService){}

  id:number = this.auth.getId();
  email:string = this.auth.getEmail()!;
  name:string = this.auth.getName()!;
  gender:string = this.auth.getGender()!;
  status:string = this.auth.getStatus()!;


  ngOnInit(): void {
      this.user.getUserById(this.auth.getId()).subscribe( (data:User) => {
       console.log(data);
      });
  }

  statusOpposite() { 
    this.auth.setStatus();
    this.status = this.auth.getStatus()!;

    
  }



}
