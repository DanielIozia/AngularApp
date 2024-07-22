import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  

  ngOnInit(): void {}

  onSubmit(form:NgForm){
    const name = form.value.name;
    const email = form.value.email;
    const gender = form.value.gender;
    const token = form.value.token;



  }

 

}
