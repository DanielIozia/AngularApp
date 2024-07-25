import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { MatSidenav } from '@angular/material/sidenav';

// Componenti
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { PostsComponent } from './components/posts/posts.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';


// Routing
import { AppRoutingModule } from './app-routing.module';

// Servizi
import { UserService } from './services/user.service';

import { AuthService } from './services/auth/auth.service';


//toolbar
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
//sidenav
import {MatSidenavModule} from '@angular/material/sidenav';

//list
import {MatListModule} from '@angular/material/list';

//tabella
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';


//card
import {MatCard, MatCardHeader, MatCardModule} from '@angular/material/card';

import { PostService } from './services/post.service';

//card
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import { ProfileComponent } from './components/profile/profile.component';
import { ConfirmDeleteDialogComponent } from './components/confirm-delete-dialog/confirm-delete-dialog.component';

import { MatDialogModule } from '@angular/material/dialog';
import { ProfileEditDialogComponent } from './components/profile-edit-dialog/profile-edit-dialog.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    UserDetailComponent,
    PostsComponent,
    PostDetailComponent,
    HomeComponent,
    PageNotFoundComponent,
    RegisterComponent,
    ProfileComponent,
    ConfirmDeleteDialogComponent,
    ProfileEditDialogComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    
    // Material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,

    MatDividerModule,
    MatTableModule,
    MatSidenav,

    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    //Card
    MatCardModule,
    MatCardHeader,
    MatProgressBarModule,
    MatChipsModule,

    //modulo di dialogo
    MatDialogModule,

    RouterOutlet

  ],
  providers: [
    AuthService,
    UserService,
    PostService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
