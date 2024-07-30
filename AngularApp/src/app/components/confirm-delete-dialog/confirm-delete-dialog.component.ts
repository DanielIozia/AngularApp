import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service'; // Importa il tuo servizio
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss']
})
export class ConfirmDeleteDialogComponent {
  loading: boolean;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string, id : number },
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loading = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.loading = true;
    const logged_user:boolean = (this.data.id == this.authService.getId()) ? true : false;
    this.userService.deleteUser(this.data.id).subscribe(() => {
      this.loading = false;
      if(logged_user){
        this.authService.logout(); // Esegui il logout dell'utente
        this.router.navigate(['/login']); // Reindirizza alla pagina di login
      }
      this.dialogRef.close(true);
    }, error => {
      console.log("Non è stato possibile eliminare l'utente:", error);
      this.error = "Failed to delete user. Please try again.";
      this.loading = false;
      this.dialogRef.close(false);
    });
  }
}
