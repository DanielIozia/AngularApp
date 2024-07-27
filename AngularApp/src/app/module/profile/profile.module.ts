import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../../components/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';
import { MatList, MatListItem } from '@angular/material/list';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../../components/confirm-post-delete-dialog/confirm-post-delete-dialog.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ProfileComponent,
    ConfirmDialogComponent,
    
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatIcon,
    MatFormField,
    MatLabel,
    MatError,
    FormsModule,
    MatList,
    MatListItem,
    MatSidenavContainer,
    MatToolbar,
    MatSidenav,
    MatSidenavContent,
    MatButtonModule,

    //prova
    MatDialogModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    
    
  ]
})
export class ProfileModule { }
