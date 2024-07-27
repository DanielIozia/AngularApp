import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from '../../components/posts/posts.component';
import { PostsRoutingModule } from './posts-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'; // Aggiungi questo
import { FormsModule } from '@angular/forms'; // Importa FormsModule

import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';


@NgModule({
  declarations: [PostsComponent],
  imports: [
    CommonModule,
    PostsRoutingModule,
    MatFormFieldModule, // Usa MatFormFieldModule anziché importare componenti singoli
    MatIconModule, // Usa MatIconModule anziché importare componenti singoli
    MatSelectModule, // Usa MatSelectModule anziché importare componenti singoli
    MatInputModule, // Aggiungi questo
    FormsModule, // Importa FormsModule
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
export class PostsModule { }
