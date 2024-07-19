import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {


  constructor(private route:Router){}

  onSubmit(addForm:NgForm){

  }

  cancelButton(){
    this.route.navigate(['/home/users']);
  }
}
