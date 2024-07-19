import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { PostsComponent } from './components/posts/posts.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
//guard
import { authGuard } from './services/auth/auth.guard';


export const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: '', redirectTo: 'login', pathMatch:'full' },
  {path: 'home', component:HomeComponent, canActivate:[authGuard],
    children:[
      {path: '', redirectTo: 'users', pathMatch:'full' },
      {path: 'users', component: UsersComponent },
      {path: 'users/:id', component: UserDetailComponent },
      {path: 'posts', component: PostsComponent },
      {path: 'posts/:id', component: PostDetailComponent },
    ] 
  },
  {path: '404', component: PageNotFoundComponent },
  {path: '**', redirectTo: '404', pathMatch:'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
