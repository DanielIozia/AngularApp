import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from '../../components/users/users.component';
import { UserDetailComponent } from '../../components/user-detail/user-detail.component';
import { UsersRoutingModule } from './users-routing.module';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatOptionModule } from '@angular/material/core'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';

@NgModule({
  declarations: [
    UsersComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    MatFormFieldModule, 
    MatIconModule, 
    MatOptionModule, 
    MatSelectModule, 
    MatInputModule,
    MatList,
    MatListItem,
    MatIcon,
    MatSidenavContainer,
    MatToolbar,
    MatSidenav,
    MatSidenavContent,
    MatButton
  ]
})
export class UsersModule { }
